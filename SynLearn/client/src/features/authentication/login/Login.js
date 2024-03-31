import React, {useEffect, useState} from 'react'
import "./Login.css"
import { useNavigate } from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {
    logIn__blockchain,
    resetError,
    selectAddressAccount,
    selectError,
    selectLoading,
    selectUser
} from "../authenticationSlice";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import {URL_SIGNUP} from "../../../config";
import PasswordIcon from '@mui/icons-material/Password';
import InputAdornment from "@mui/material/InputAdornment";
import ImportContactsIcon from '@mui/icons-material/ImportContacts';

export const Login = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const user = useSelector(selectUser)
    const loading = useSelector(selectLoading)
    const error = useSelector(selectError)

    const addressAccount = useSelector(selectAddressAccount)
    const [password, setPassword] = useState("")

    useEffect(() => {
        dispatch(resetError())
    }, [])

    return(
        <form className="login">
            <p className="login__title">Login</p>
            <TextField className={"signUp__input"} label="Address Account" variant="standard"
                       value={addressAccount}
                       disabled={true}
                       InputProps={{
                           startAdornment: (
                               <InputAdornment position="start">
                                   <ImportContactsIcon />
                               </InputAdornment>
                           ),
                       }}
            />
            <TextField className={"signUp__input"} label="Password" variant="outlined" type={"password"}
                       value={password}
                       onChange={e => setPassword(e.target.value)}
                       InputProps={{
                           startAdornment: (
                               <InputAdornment position="start">
                                   <PasswordIcon />
                               </InputAdornment>
                           ),
                       }}
            />
            <LoadingButton type={"submit"} loading={loading} variant="contained"
                           className="signUp__btnLogIn"
                           disabled={!password}
                           onClick={() => dispatch(logIn__blockchain(password))}
            >Log In</LoadingButton>
            {
                error.flag ?
                    <Alert severity="error">{error.message}</Alert>
                    :
                    ""
            }
            <Button
                className="logIn__btnSignUp"
                onClick={() => navigate(URL_SIGNUP)}
                size="small"
            >Sign Up</Button>
        </form>
    )
}