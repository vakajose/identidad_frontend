// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract IdentityManagement {
    struct Document {
        string docType;
        string docHash;
    }

    mapping(address => Document[]) private documents;
    mapping(address => mapping(address => bool)) private authorizations;

    function registerProvider(string memory docType, string memory docHash) public {
        documents[msg.sender].push(Document(docType, docHash));
    }

    function authorizeConsumer(address consumer) public {
        require(msg.sender != consumer, "No puedes autorizarte a ti mismo");
        authorizations[msg.sender][consumer] = true;
    }

    function revokeAuthorization(address consumer) public {
        require(authorizations[msg.sender][consumer], "El consumidor no esta autorizado");
        authorizations[msg.sender][consumer] = false;
    }

    function getMyDocuments() public view returns (Document[] memory) {
        return documents[msg.sender];
    }

    function getDocuments(address provider) public view returns (Document[] memory) {
        // Permitir al proveedor ver sus propios documentos o verificar autorización
        require(authorizations[provider][msg.sender] || msg.sender == provider, "No autorizado para ver los documentos");
        return documents[provider];
    }
}
