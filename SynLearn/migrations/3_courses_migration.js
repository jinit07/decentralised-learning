const Courses = artifacts.require("Courses");

module.exports = function (deployer) {
    deployer.deploy(Courses);
};
