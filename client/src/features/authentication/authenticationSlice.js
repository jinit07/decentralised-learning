import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {AuthenticationContractAddress, ROLE_SIMPLE} from "../../config"
import Authentication from "../../contracts/Authentication.json"
import {ethers} from 'ethers'

const initialState = {
    addressAccount : "",
    user: {},
    connected: false,
    loading: false,
    error: {
        flag: false,
        message: "",
    },
    verifyingUserBlockchain: true,
    idSetInterval: null
}

async function initialProviderAuthentication () {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(AuthenticationContractAddress, Authentication.abi, signer);
}

export const getAddressAccount = createAsyncThunk(
    'getAddressAccount',
    async (_) => {
        const account = await window.ethereum.request({ method: 'eth_requestAccounts' });
        return account[0];
    }
)

export const signUp__blockchain = createAsyncThunk(
    'signUp__blockchain',
    async (signUpInputs) => {
        if(window.ethereum !== 'undefined'){
            const contractAuthentication = await initialProviderAuthentication()
            try{
                const response = await contractAuthentication.areYouAlreadySignUp()
                if(response) return {error: true, msg: "You're already signed up !"};
                await contractAuthentication.signUp(signUpInputs.firstName, signUpInputs.familyName, signUpInputs.typeUser, signUpInputs.password)
                // return {error: false, response: await contractAuthentication.logIn(signUpInputs.password)}
                return {error: false, response: {firstName: signUpInputs.firstName, familyName: signUpInputs.familyName, typeUser: signUpInputs.typeUser, role: ROLE_SIMPLE}}
            } catch (e) {
                console.log('Error sign up to blockchain : ', e);
                // console.log("wesh")
                return {error: true, msg: "Error to sign in to blockchain !"}
            }
        }
    }
)

export const logIn__blockchain = createAsyncThunk(
    'logIn__blockchain',
    async (_password) => {
        if(window.ethereum !== 'undefined'){
            const contractAuthentication = await initialProviderAuthentication()
            try{
                const response = await contractAuthentication.areYouAlreadySignUp()
                if(!response) return {error: true, msg: "You have to sign up first !"}
                const response2 = await contractAuthentication.doesPasswordCorrect(_password)
                if(!response2) return {error: true, msg: "Incorrect password !"}
                return {error: false, response: await contractAuthentication.logIn(_password)}
            } catch (e) {
                console.log('Error log in to blockchain : ', e);
                return {error: true, msg: "Error to log in to blockchain !"}
            }
        }
    }
)

export const authenticationSlice = createSlice({
    name: 'authentication',
    initialState,
    reducers: {
        handleLogOut : state => {
            state.user = {};
            sessionStorage.removeItem("userBlockchain");
            state.connected = false;
        },
        handleLogInFromSessionStorage: (state, action) => {
            state.user = action.payload;
            state.connected = true;
        },
        resetError : state => {
            state.error.flag = false;
            state.error.message = "";
        },
        setIdMyInterval : (state, action) => {
            state.idSetInterval = action.payload;
        },
        clearMyInterval : state => {
            clearInterval(state.idSetInterval);
        },
        stopVerifyingUserBlockchain: state => {
            state.verifyingUserBlockchain = false;
        }
    },
    extraReducers: {
        // Get Address
        [getAddressAccount.fulfilled] : (state, action) => {
            state.addressAccount = action.payload;
        },
        // Sign Up
        [signUp__blockchain.pending] : state => {
            state.loading = true;
            state.error.flag = false;
            state.connected = false;
        },
        [signUp__blockchain.fulfilled] : (state, action) => {
            if(action.payload.error){
                state.error.flag = true;
                state.error.message = action.payload.msg;
            } else{
                state.user = action.payload.response;
                const userStorage = {addressAccount: state.addressAccount, ...state.user};
                sessionStorage.setItem("userBlockchain", JSON.stringify(userStorage))
                state.connected = true;
            }
            state.loading = false
        },
        [signUp__blockchain.rejected] : (state) => {
            state.error.flag = true
            state.error.message = "Error signing up from the blockchain !"
            state.loading = false
        },
        // Log In
        [logIn__blockchain.pending] : state => {
            state.loading = true;
            state.error.flag = false;
            state.connected = false;
        },
        [logIn__blockchain.fulfilled] : (state, action) => {
            if(action.payload.error){
                state.error.flag = true
                state.error.message = action.payload.msg
            } else {
                state.user.firstName = action.payload.response[0];
                state.user.familyName = action.payload.response[1];
                state.user.typeUser = action.payload.response[2];
                state.user.role = action.payload.response[3];
                const userStorage = {addressAccount: state.addressAccount, ...state.user};
                sessionStorage.setItem("userBlockchain", JSON.stringify(userStorage));
                state.connected = true;
            }
            state.loading = false
        },
        [logIn__blockchain.rejected] : (state) => {
            state.error.flag = true;
            state.error.message = "Error log in from the blockchain !";
            state.loading = false;
        }
    },
});

export const {handleLogOut, resetError, handleLogInFromSessionStorage, setIdMyInterval, clearMyInterval,stopVerifyingUserBlockchain} = authenticationSlice.actions;

export const selectAddressAccount = state => state.authentication.addressAccount;
export const selectUser = state => state.authentication.user;
export const selectLoading = state => state.authentication.loading;
export const selectError = state => state.authentication.error;
export const selectConnected = state => state.authentication.connected;
export const selectVerifyingUserBlockchain = state => state.authentication.verifyingUserBlockchain;

export default authenticationSlice.reducer;
