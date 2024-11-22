const IdentityManagement = artifacts.require("IdentityManagement");

module.exports = async function (deployer) {
    try {
        await deployer.deploy(IdentityManagement);
        console.log("IdentityManagement deployed successfully");
    } catch (error) {
        console.error("Error deploying IdentityManagement:", error);
    }
};
