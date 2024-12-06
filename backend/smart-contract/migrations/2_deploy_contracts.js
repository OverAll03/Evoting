const EVoting = artifacts.require("EVoting");

module.exports = function(deployer) {
  deployer.deploy(EVoting);
};
