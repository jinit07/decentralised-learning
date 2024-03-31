async function main() {

  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // deploy contracts here:

  const SUPPLY = 1000;

  const Token_contract = await ethers.getContractFactory("FST"); //CHANGE
  const token_contract = await Token_contract.deploy(SUPPLY);
  console.log("Token contract deployed at", token_contract.address);
  
  
  // For each contract, pass the deployed contract and name to this function to save a copy of the contract ABI and address to the front end.
  // CHANGE
  saveFrontendFiles(token_contract, "FST");

  const Admin_contract = await ethers.getContractFactory("Admin"); //CHANGE
  const admin_contract = await Admin_contract.deploy(token_contract.address);
  console.log("Admin contract deployed at", admin_contract.address);
  
  
  // For each contract, pass the deployed contract and name to this function to save a copy of the contract ABI and address to the front end.
  // CHANGE
  saveFrontendFiles(admin_contract, "Admin");

  //Activity here

  const token_name = await token_contract.name();
  console.log("Token name", token_name);

  const transact = await token_contract.connect(deployer).transfer(admin_contract.address, SUPPLY)
  console.log("Contract Balance is ", await token_contract.balanceOf(admin_contract.address))

  // const original_val = await contract.retrieve()
  // console.log("Original value", original_val)

  // console.log("Updating to 10")
  // const chang_transact = await contract.connect(deployer).store(10);
  // console.log("Changed successfully")

  // const new_val = await contract.retrieve();
  // console.log("New val", new_val)

  

}

function saveFrontendFiles(contract, name) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../../frontend/contractsData";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + `/${name}-address.json`,
    JSON.stringify({ address: contract.address }, undefined, 2)
  );

  const contractArtifact = artifacts.readArtifactSync(name);

  fs.writeFileSync(
    contractsDir + `/${name}.json`,
    JSON.stringify(contractArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
