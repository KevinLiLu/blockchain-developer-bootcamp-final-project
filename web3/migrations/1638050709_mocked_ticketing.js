const MockedTicketing = artifacts.require("MockedTicketing");

module.exports = function(deployer) {
  deployer.deploy(MockedTicketing);
};