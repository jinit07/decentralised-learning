const Authentication = artifacts.require("Authentication");

module.exports = function (deployer) {
    deployer.deploy(Authentication);
};
