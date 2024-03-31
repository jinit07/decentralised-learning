// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract FST is ERC20 {
    constructor(uint256 initialSupply) ERC20("Syndicate", "Syn") {
        _mint(msg.sender, initialSupply);
    }

    function burn(address from, uint256 amount) public{
        _burn(from, amount);
    }
}


contract Admin{
    ERC20 token;
    FST token_new;
    IERC20 tokenInterface;
    address Owner;
    uint tokenCounter;
    uint currentBatch; 
    constructor (address TOKEN_ADDRESS){
        Owner = msg.sender;
        tokenCounter = 0;
        currentBatch = 1;
        token_new = FST(TOKEN_ADDRESS);
        token = ERC20(TOKEN_ADDRESS);
        tokenInterface = IERC20(TOKEN_ADDRESS);
    }

    mapping(uint256 => address) public token_address;
    mapping(uint256 => string) public token_name;
    mapping(uint256 => uint256) public token_batch;
    mapping(address => uint256) public address_token; 
    address[] public address_Array;



    function addStudent(string memory name, uint batch, address student_address) public {
        require(msg.sender == Owner, "You can't add");
        address_Array.push(student_address);
        tokenCounter = tokenCounter + 1;
        token_address[tokenCounter] = student_address;
        token_name[tokenCounter] = name;
        token_batch[tokenCounter] = batch;
        address_token[student_address] = tokenCounter;
        if (batch > currentBatch){
            currentBatch = batch;
        }      
        
    }
      

    function burnit() public {
        uint256 min_batch = currentBatch - 4 + 1;
        for(uint256 iter = 0; iter < tokenCounter; iter = iter + 1){
            address person = address_Array[iter];
         uint256 _token = address_token[person];
         uint256 _batch = token_batch[_token];
         uint256 _balance = tokenInterface.balanceOf(person);
         if(_batch < min_batch){
             token_new.burn(person, _balance);
        }
    }
    }

    function Transfer_Admin(uint _token, uint amount) public {
        require(msg.sender == Owner, "You are not the owner");
        uint balance = tokenInterface.balanceOf(address(this));
        require(balance >= amount, "Insufficient balance");
        address to = token_address[_token];
        tokenInterface.transfer(to, amount);
    }



    function TransferStudent(uint256 amount, uint256 _token_to) public {
        address from = msg.sender;
        address to = token_address[_token_to];

        //ADD THE TRANSFER LOGIC HERE



        uint256 from_token = address_token[from];
        uint256 from_batch = token_batch[from_token];

        uint256 to_batch = token_batch[_token_to];

        uint256 penalty = 0;
        if(from_batch != to_batch){
            penalty = 25;
        }

        uint256 amount_to_transfer = (amount * (100-penalty))/100;
        token.transferFrom(from, to, amount_to_transfer);
        token.transferFrom(from, address(this), amount - amount_to_transfer);
    }

    function totalPeople() public view returns(uint256){
        return tokenCounter;
    }


    function name_token() public view returns(string memory) {
        return token.name();
    }

    function getBalance() public view returns(uint256){
        return tokenInterface.balanceOf(address(this));
    }

    function token_to_address(uint256 _token) public view returns(address){
        return token_address[_token];
    }

    function address_to_token(address _Address) public view returns(uint256){
        return address_token[_Address];
    }

    function token_to_name(uint256 _token) public view returns(string memory){
        return token_name[_token];
    }

    function token_to_batch(uint256 _token) public view returns(uint256){
        return token_batch[_token];
    }

    function getOwner() public view returns(address){
        return Owner;
    }

}