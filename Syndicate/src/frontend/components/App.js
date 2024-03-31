
import logo from './logo.png';
import './App.css';
import { useState } from 'react';
import { ethers } from 'ethers'; 
import { Button } from 'react-bootstrap';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
// import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Web3 from 'web3'
import { useEffect } from 'react';

import AdminAbi from "../contractsData/Admin.json";
import AdminAddress from "../contractsData/Admin-address.json";
import FSTAbi from "../contractsData/FST.json";
import FSTAddress from "../contractsData/FST-address.json";


import { NavBar } from './comp/Navbar';
import { Dashboard } from './comp/Dashboard';
import { Add } from './comp/Add';
import { Award } from './comp/Award';
import { Transfer } from './comp/Transfer';
import { Footer } from './comp/Footer';
// import { Das}

 
function App() {

  const [account, setAccount] = useState(null);
  const [admin, setAdminContract] = useState(null);
  const [tokenContract, setTokenContract] = useState(null);
  const [address, setAddress] = useState(null);
  const [web3, setWeb3] = useState(null)

  const [owner, setOwner] = useState("");
  const [token_name, set_Token_name] = useState("");
  const [admin_balance, setAdminBalance] = useState("");
  const [account_balance, setAccountBalance] = useState(0);
  const [account_name, setAccountName] = useState("")
  const [account_batch, setAccountBatch] = useState(0);
  const [account_token, setAccountToken] = useState(0);


  const [totalPeople, setTotalPeople] = useState(0);
  const [student_name, setStudentName] = useState([])
  const [student_token, setStudentToken] = useState([])
  const [student_Batch, setStudentBatch] = useState([])
  const [student_Balance, setStudentBalance] = useState([])




  useEffect(() => {
    if (admin && tokenContract){
        getOwnerHandler()
        
       
          
    if(account != null) {
      // CustomerHandler()
      console.log("Already connected")
    }
    else{
      // setTimeout(ConnectWalletHandler,500);
      ConnectWalletHandler()
    }
        
    }
    else{
        ContractHandler()
    }
})

  const ContractHandler = async () => {
    if(typeof window !== "undefined" && typeof window.ethereum !== "undefined"){
      console.log("in VmCotractHandler")
        try {
          const _web3 = await new Web3(window.ethereum);
          setWeb3(_web3)
            console.log("Web3 set")
            const abi = AdminAbi.abi;
            const contractAddress = AdminAddress.address;
            setAddress(contractAddress);
            
            const vm = await new web3.eth.Contract(abi, contractAddress);
            setAdminContract(vm)
            console.log("Contract set")
            // setEMsg("Contract fetched")
            const abi_token = FSTAbi.abi;
            const address_token = FSTAddress.address;
            const token_vm = await new web3.eth.Contract(abi_token, address_token);
            setTokenContract(token_vm);
            console.log("Token contract set");            
        }
        catch (err) {
  
            // setError("Awaiting contract...")
            // setSuccessMsg("")
            console.log(err)
        }
    }
  }
  
  const ConnectWalletHandler = async() => {
    console.log("Connect wallet fired")
    if(typeof window !== "undefined" && typeof window.ethereum !== "undefined"){
        try {
           
            const provider = await new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signers = provider.getSigner();
            const address = await signers.getAddress();
            setAccount(address);
            // setSuccessMsg("Wallet connected")
            console.log("Wallet connected")
            // setError("")
            console.log("Wallet address is", address)
           
        }
        catch (err) {
            console.log(err)
        }
  }

  }

  const getOwnerHandler = async() => {
    const add_owner = await admin.methods.getOwner().call();
    setOwner(add_owner);
    console.log("Owner is ", owner)
    getTokenName()
  }


  const getTokenName = async() => {
    console.log("in token name")
    const token_name = await tokenContract.methods.name().call();
    set_Token_name(token_name)
    console.log("Token name is ",token_name)
    balance_handler()
  }

  const balance_handler = async() => {
    const balance = await tokenContract.methods.balanceOf(AdminAddress.address).call();
    setAdminBalance(balance);
    console.log("Admin balance is ", admin_balance);
    const balance1 = await tokenContract.methods.balanceOf(account).call();
    setAccountBalance(balance1);
    console.log("Balance of account is ", account_balance )
    detail_handler()
  }

  // const changeVal = async() => {
  //   console.log("Changing value")
  //   const change_value_transact = await storage.methods.store(18).send({from: account});
  //   // setVal(value)
  //   console.log("Value is changed ",val)
  // }

  const AddStudentHandler = async(_name, _batch, _address) => {
    const transact = await admin.methods.addStudent(_name, _batch, _address).send({from: account});
    console.log("Added successfully!")
    // const burn = await admin.methods.burnit().send({from: account});
    // console.log("Burning successfull")
    BurnHandler()
  }

  const BurnHandler = async() => {
    const burn = await admin.methods.burnit().send({from: account});
    console.log("Burning successfull")
  }

  const Transfer_Admin_handler = async(_token, _amount) => {
    const transact = await admin.methods.Transfer_Admin(_token, _amount).send({from: account});
    console.log("Awarded successfully!")
  }

  const TransferHandler = async(_tokenId, _amount) => {
    const approve = await tokenContract.methods.approve(AdminAddress.address, _amount).send({from: account});
    console.log("Approved succcessfully")
    const transfer = await admin.methods.TransferStudent(_amount, _tokenId).send({from: account});
    console.log("Transferred successfully")
  }

  const detail_handler = async() => {
    const token = await admin.methods.address_to_token(account).call();
    console.log("Account is", account)
    setAccountToken(token + 1)
    console.log("Token is ", token)
    const name = await admin.methods.token_to_name(token).call();
    setAccountName(name)
    const batch = await admin.methods.token_to_batch(token).call();
    setAccountBatch(batch);
    console.log("Name is ", account_name)
    console.log("Batch is ", account_batch);
    const total = await admin.methods.totalPeople().call();
    console.log("Total people ", total)
    // studentHandler()
  }

  const studentHandler = async() => {
    const total = await admin.methods.totalPeople().call();
    setTotalPeople(total)
    const local_name = []
    const local_batch = []
    const local_Id = []
    const local_balance = []
    for (let index = 0; index < totalPeople; index++) {
      const name = await admin.methods.token_to_name(index+1).call();
      local_name.push(name)
      const batch = await admin.methods.token_to_batch(index+1).call();
      local_batch.push(batch)
      local_Id.push(index + 1)
      const address = await admin.methods.token_to_address(index + 1).call();
      const bal = await tokenContract.methods.balanceOf(address).call();
      local_balance.push(bal)
    }
    setStudentBalance(local_balance)
    setStudentName(local_name)
    setStudentToken(local_Id)
    setStudentBatch(local_batch)
  }

  

  return (
    <BrowserRouter>
      <body>
      <NavBar owner = {owner} account = {account} ConnectWalletHandler = {ConnectWalletHandler} address = {address}/>

       <main>
          <Routes>
            <Route exact path="/" element={<>
              <Dashboard burnHandler = {BurnHandler} name = {account_name} batch = {account_batch}  owner = {owner} admin_address = {AdminAddress.address} account = {account} admin_balance = {admin_balance} balance = {account_balance} />
              </>}>
            </Route>
            <Route exact path="/Add" element={<>
                <Add student_name = {student_name} student_Batch = {student_Batch} student_token = {student_token} student_Balance = {student_Balance} AddStudentHandler = {AddStudentHandler}/>
              </>}>
            </Route>
            <Route exact path="/Award" element={<>
                <Award student_name = {student_name} student_Batch = {student_Batch} student_token = {student_token} student_Balance = {student_Balance} Transfer_Admin = {Transfer_Admin_handler}/>
              </>}>
            </Route>
            <Route exact path="/Transfer" element={<>
                <Transfer TransferHandler = {TransferHandler}/>
              </>}>
            </Route>
          </Routes>
        </main>
  
    
        <Footer/>
      </body>
    </BrowserRouter>
  );
}

export default App;
