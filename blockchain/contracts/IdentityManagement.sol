// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract IdentityManagement {
    struct Document {
        string docType;
        string docHash;
    }

    mapping(address => Document[]) private documents;
    mapping(address => mapping(address => bool)) private authorizations;
    mapping(address => address[]) private authorizedConsumers;

    event DocumentRegistered(address indexed provider, string docType, string docHash);
    event AuthorizationGranted(address indexed provider, address indexed consumer);
    event AuthorizationRevoked(address indexed provider, address indexed consumer);

    function registerProvider(string memory docType, string memory docHash) public {
        documents[msg.sender].push(Document(docType, docHash));
        emit DocumentRegistered(msg.sender, docType, docHash);
    }

    function authorizeConsumer(address consumer) public {
        require(msg.sender != consumer, "No puedes autorizarte a ti mismo");
        require(!authorizations[msg.sender][consumer], "El consumidor ya esta autorizado");
        
        authorizations[msg.sender][consumer] = true;
        authorizedConsumers[msg.sender].push(consumer);
        emit AuthorizationGranted(msg.sender, consumer);
    }

    function revokeAuthorization(address consumer) public {
        require(authorizations[msg.sender][consumer], "El consumidor no esta autorizado");
        
        authorizations[msg.sender][consumer] = false;
        
        // Eliminar el consumidor de la lista de autorizados
        for (uint i = 0; i < authorizedConsumers[msg.sender].length; i++) {
            if (authorizedConsumers[msg.sender][i] == consumer) {
                authorizedConsumers[msg.sender][i] = authorizedConsumers[msg.sender][authorizedConsumers[msg.sender].length - 1];
                authorizedConsumers[msg.sender].pop();
                break;
            }
        }
        
        emit AuthorizationRevoked(msg.sender, consumer);
    }

    function getMyDocuments() public view returns (Document[] memory) {
        return documents[msg.sender];
    }

    function getDocuments(address provider) public view returns (Document[] memory) {
        require(msg.sender == provider || authorizations[provider][msg.sender], "No autorizado para ver los documentos");
        return documents[provider];
    }

    function getAuthorizedConsumers() public view returns (address[] memory) {
        return authorizedConsumers[msg.sender];
    }
}
