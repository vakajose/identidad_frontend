const IdentityManagement = artifacts.require("IdentityManagement");

contract("IdentityManagement", accounts => {
  const [provider1, provider2, consumer1, consumer2] = accounts;

  it("debería permitir que los proveedores registren documentos", async () => {
    const instance = await IdentityManagement.deployed();

    // Proveedor 1 registra un documento
    await instance.registerProvider("DNI", "hashDocumentoProveedor1", {from: provider1});
    // Proveedor 2 registra otro documento
    await instance.registerProvider("Licencia de Conducir", "hashDocumentoProveedor2", {from: provider2});

    // Verificar que los documentos fueron registrados
    const documentsProvider1 = await instance.getDocuments(provider1, {from: provider1});
    assert.equal(documentsProvider1.length, 1, "Proveedor 1 debería tener un documento registrado");

    const documentsProvider2 = await instance.getDocuments(provider2, {from: provider2});
    assert.equal(documentsProvider2.length, 1, "Proveedor 2 debería tener un documento registrado");
  });

  it("debería permitir que los proveedores vean sus propios documentos", async () => {
    const instance = await IdentityManagement.deployed();

    // Proveedor 1 consulta sus propios documentos
    const documentsProvider1 = await instance.getDocuments(provider1, {from: provider1});
    assert.equal(documentsProvider1[0].docType, "DNI", "Proveedor 1 debería poder ver su propio documento");

    // Proveedor 2 consulta sus propios documentos
    const documentsProvider2 = await instance.getDocuments(provider2, {from: provider2});
    assert.equal(documentsProvider2[0].docType, "Licencia de Conducir", "Proveedor 2 debería poder ver su propio documento");
  });

  it("debería permitir a los proveedores autorizar a los consumidores", async () => {
    const instance = await IdentityManagement.deployed();

    // Proveedor 1 autoriza a Consumidor 1
    await instance.authorizeConsumer(consumer1, {from: provider1});
    // Proveedor 2 autoriza a Consumidor 2
    await instance.authorizeConsumer(consumer2, {from: provider2});

    // Verificar autorización mediante acceso a documentos
    const documentsProvider1 = await instance.getDocuments(provider1, {from: consumer1});
    assert.equal(documentsProvider1.length, 1, "Consumidor 1 debería tener acceso al documento del Proveedor 1");

    const documentsProvider2 = await instance.getDocuments(provider2, {from: consumer2});
    assert.equal(documentsProvider2.length, 1, "Consumidor 2 debería tener acceso al documento del Proveedor 2");
  });

  it("debería permitir a los proveedores revocar autorización a los consumidores", async () => {
    const instance = await IdentityManagement.deployed();

    // Proveedor 1 revoca el acceso del Consumidor 1
    await instance.revokeConsumer(consumer1, {from: provider1});
    // Proveedor 2 revoca el acceso del Consumidor 2
    await instance.revokeConsumer(consumer2, {from: provider2});

    // Verificar que el acceso haya sido revocado
    try {
      await instance.getDocuments(provider1, {from: consumer1});
      assert.fail("Consumidor 1 no debería tener acceso a los documentos del Proveedor 1 después de la revocación");
    } catch (error) {
      assert.include(error.message, "No autorizado para ver los documentos", "Error esperado al intentar acceder después de la revocación");
    }

    try {
      await instance.getDocuments(provider2, {from: consumer2});
      assert.fail("Consumidor 2 no debería tener acceso a los documentos del Proveedor 2 después de la revocación");
    } catch (error) {
      assert.include(error.message, "No autorizado para ver los documentos", "Error esperado al intentar acceder después de la revocación");
    }
  });
});
