// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract IdentityManagement is ERC1155 {
    struct TokenData {
        string encryptedData; // Datos cifrados del token
        uint16 tokenType;     // Tipo de documento (1: Cédula, 2: Licencia, 3: Pasaporte, 4: Otro)
        string uniqueId;      // Identificador único
        bool isCurrent;       // Indica si es la versión vigente
        uint256 createdAt;    // Fecha de creación (timestamp)
        uint256 updatedAt;    // Fecha de última actualización (timestamp)
    }

    struct AddressTokens {
        address _address;
        uint256[] tokenIds;
    }

    mapping(uint256 => TokenData[]) private tokenVersions; // tokenId -> versiones de datos
    mapping(uint256 => address) private tokenProviders;   // tokenId -> proveedor
    mapping(address => uint256[]) private providerTokens; // proveedor -> lista de tokenId
    mapping(address => mapping(uint256 => uint256[])) private providerTokensByType; // proveedor -> tipo -> lista de tokenId
    mapping(address => mapping(address => mapping(uint256 => bool))) private authorizations; // proveedor -> consumidor -> tokenId -> autorizado
    mapping(address => address[]) private providerConsumers; // proveedor -> lista de consumidores
    mapping(address => mapping(address => uint256[])) private consumerAccess; // proveedor -> consumidor -> lista de tokenId
    mapping(address => address[]) private consumerProviders; // consumidor -> lista de proveedores
    mapping(address => mapping(address => uint256[])) private reverseAccess; // consumidor -> proveedor -> lista de tokenId

    event TokenCreated(uint256 tokenId, string uniqueId, uint16 tokenType, address indexed provider);
    event TokenUpdated(uint256 tokenId, address indexed provider, string newData);
    event AuthorizationGranted(address indexed provider, address indexed consumer, uint256 tokenId);
    event AuthorizationRevoked(address indexed provider, address indexed consumer, uint256 tokenId);

    constructor() ERC1155("") {}

    // Crear un nuevo token
    function mintToken(uint16 tokenType, string memory encryptedData) public {
        string memory uniqueId = generateUniqueId(tokenType, msg.sender);
        uint256 tokenId = uint256(keccak256(abi.encodePacked(uniqueId))); // Convertir uniqueId a uint256

        tokenVersions[tokenId].push(TokenData(encryptedData, tokenType, uniqueId, true, block.timestamp, block.timestamp));
        tokenProviders[tokenId] = msg.sender;
        providerTokens[msg.sender].push(tokenId);
        providerTokensByType[msg.sender][tokenType].push(tokenId);

        emit TokenCreated(tokenId, uniqueId, tokenType, msg.sender); // Incluimos uniqueId en el evento
    }

    // Actualizar un token existente
    function updateToken(uint256 tokenId, string memory newEncryptedData) public {
        require(tokenProviders[tokenId] == msg.sender, "No autorizado");

        uint256 versionCount = tokenVersions[tokenId].length;
        require(versionCount > 0, "No versions available for this token");
        tokenVersions[tokenId][versionCount - 1].isCurrent = false;
        TokenData memory lastVersion = tokenVersions[tokenId][versionCount - 1];
        tokenVersions[tokenId].push(TokenData(newEncryptedData,lastVersion.tokenType,lastVersion.uniqueId, true, tokenVersions[tokenId][0].createdAt, block.timestamp));

        emit TokenUpdated(tokenId, msg.sender, newEncryptedData);
    }

    // Autorizar múltiples tokens
    function authorizeMultiple(address consumer, uint256[] memory tokenIds) public {
        for (uint256 i = 0; i < tokenIds.length; i++) {
            uint256 tokenId = tokenIds[i];
            require(tokenProviders[tokenId] == msg.sender, "No autorizado");
            require(!authorizations[msg.sender][consumer][tokenId], "Ya autorizado");
            authorizations[msg.sender][consumer][tokenId] = true;
            consumerAccess[msg.sender][consumer].push(tokenId);
            //agregar el consumer a providerConsumers si y solo si el consumidor no existe en la lista
            if (providerConsumers[msg.sender].length == 0) {
                providerConsumers[msg.sender].push(consumer);
            } else {
                bool exists = false;
                for (uint256 j = 0; j < providerConsumers[msg.sender].length; j++) {
                    if (providerConsumers[msg.sender][j] == consumer) {
                        exists = true;
                        break;
                    }
                }
                if (!exists) {
                    providerConsumers[msg.sender].push(consumer);
                }
            }
            reverseAccess[consumer][msg.sender].push(tokenId);
            //agregar el provider a consumerProviders si y solo si el provider no existe en la lista
            if (consumerProviders[consumer].length == 0) {
                consumerProviders[consumer].push(msg.sender);
            } else {
                bool exists = false;
                for (uint256 j = 0; j < consumerProviders[consumer].length; j++) {
                    if (consumerProviders[consumer][j] == msg.sender) {
                        exists = true;
                        break;
                    }
                }
                if (!exists) {
                    consumerProviders[consumer].push(msg.sender);
                }
            }

            emit AuthorizationGranted(msg.sender, consumer, tokenId);
        }
    }

    // Revocar múltiples autorizaciones
    function revokeMultiple(address consumer, uint256[] memory tokenIds) public {
        for (uint256 i = 0; i < tokenIds.length; i++) {
            uint256 tokenId = tokenIds[i];
            require(tokenProviders[tokenId] == msg.sender, "No autorizado");
            require(authorizations[msg.sender][consumer][tokenId], "No autorizado actualmente");
            authorizations[msg.sender][consumer][tokenId] = false;

            // Eliminar de consumerAccess
            _removeToken(consumerAccess[msg.sender][consumer], tokenId);
            // Eliminar de providerConsumers si no tiene más tokens autorizados por el proveedor
            if (consumerAccess[msg.sender][consumer].length == 0) {
                _removeAddress(providerConsumers[msg.sender], consumer);
            }
            _removeToken(reverseAccess[consumer][msg.sender], tokenId);
            // Eliminar de consumerProviders si no tiene más tokens autorizados por el proveedor
            if (reverseAccess[consumer][msg.sender].length == 0) {
                _removeAddress(consumerProviders[consumer], msg.sender);
            }

            emit AuthorizationRevoked(msg.sender, consumer, tokenId);
        }
    }

    // Obtener tokens autorizados por algun proveedor
    function getTokensFromProvider(address provider) public view returns (uint256[] memory) {
        return reverseAccess[msg.sender][provider];
    }

    // Obtener consumidores autorizados por mí
    function getConsumers() public view returns (AddressTokens[] memory) {
        address[] memory consumersList = providerConsumers[msg.sender];
        uint256 consumerCount = consumersList.length;

        // Crear el array de respuesta
        AddressTokens[] memory consumers = new AddressTokens[](consumerCount);

        // Llenar el array con los datos de cada consumidor
        for (uint256 i = 0; i < consumerCount; i++) {
            address consumerAddress = consumersList[i];
            consumers[i] = AddressTokens({
                _address: consumerAddress,
                tokenIds: consumerAccess[msg.sender][consumerAddress]
            });
        }

        return consumers;
    }

    // Obtener providers que me han autorizado a mi
    function getProviders() public view returns (AddressTokens[] memory) {
        address[] memory providersList = consumerProviders[msg.sender];
        uint256 providersCount = providersList.length;

        // Crear el array de respuesta
        AddressTokens[] memory providers = new AddressTokens[](providersCount);

        // Llenar el array con los datos de cada consumidor
        for (uint256 i = 0; i < providersCount; i++) {
            address providerAddress = providersList[i];
            providers[i] = AddressTokens({
                _address: providerAddress,
                tokenIds: reverseAccess[msg.sender][providerAddress]
            });
        }

        return providers;
    }

    // Obtener mis tokens
    function getMyTokens() public view returns (uint256[] memory) {
        return providerTokens[msg.sender];
    }

    // Obtener tokens por tipo
    function getTokensByType(uint256 tokenType) public view returns (uint256[] memory) {
        return providerTokensByType[msg.sender][tokenType];
    }

    // Obtener datos del token (verifica autorización)
    function getTokenData(uint256 tokenId) public view returns (TokenData memory) {
        address provider = tokenProviders[tokenId];
        require(provider == msg.sender || authorizations[provider][msg.sender][tokenId], "No autorizado");

        uint256 versionCount = tokenVersions[tokenId].length;
        return tokenVersions[tokenId][versionCount - 1];
    }

    // Generar ID único
    function generateUniqueId(uint256 tokenType, address provider) private view returns (string memory) {
        string memory typePrefix = _getTypePrefix(tokenType);
        bytes32 hashPart = keccak256(abi.encodePacked(provider, block.timestamp, block.prevrandao));
        return string(abi.encodePacked(typePrefix, _toHex(hashPart)));
    }

    // Obtener prefijo de tipo
    function _getTypePrefix(uint256 tokenType) private pure returns (string memory) {
        if (tokenType == 1) return "CEDU"; // Cédula
        if (tokenType == 2) return "LICE"; // Licencia
        if (tokenType == 3) return "PASP"; // Pasaporte
        return "GENR"; // General
    }

    // Convertir bytes32 a string hexadecimal
    function _toHex(bytes32 data) private pure returns (string memory) {
        bytes memory hexa = new bytes(64);
        for (uint256 i = 0; i < 32; i++) {
            uint8 byteValue = uint8(data[i]);
            hexa[i * 2] = _hexChar(byteValue / 16);
            hexa[i * 2 + 1] = _hexChar(byteValue % 16);
        }
        return string(hexa);
    }

    function _hexChar(uint8 value) private pure returns (bytes1) {
        return value < 10 ? bytes1(value + 48) : bytes1(value + 87);
    }

    // Eliminar token de lista
    function _removeToken(uint256[] storage list, uint256 tokenId) private {
        for (uint256 i = 0; i < list.length; i++) {
            if (list[i] == tokenId) {
                list[i] = list[list.length - 1];
                list.pop();
                break;
            }
        }
    }

    // Eliminar token de lista
    function _removeAddress(address[] storage list, address _address) private {
        for (uint256 i = 0; i < list.length; i++) {
            if (list[i] == _address) {
                list[i] = list[list.length - 1];
                list.pop();
                break;
            }
        }
    }
}
