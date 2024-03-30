import React, {useEffect, useState} from 'react'
import "./SignUp.css"
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {
    resetError,
    selectAddressAccount, selectError, selectLoading,
    signUp__blockchain,
} from "../authenticationSlice";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import Alert from "@mui/material/Alert";
import LoadingButton from '@mui/lab/LoadingButton';
import {TYPE_EMPLOYEE, TYPE_STUDENT} from "../../../config";

export const SignUp = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const addressAccount = useSelector(selectAddressAccount)
    const loading = useSelector(selectLoading)
    const error = useSelector(selectError)

    const [firstName, setFirstName] = useState("")
    const [familyName, setFamilyName] = useState("")
    const [typeUser, setTypeUser] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirm, setPasswordConfirm] = useState("")
    const [errorPassword, setErrorPassword] = useState(false)

    const goToLogin = (e) => {
        e.preventDefault()
        navigate("/")
    }

    const signUp = (e) => {
        e.preventDefault()
        if(password !== passwordConfirm) setErrorPassword(true)
        else dispatch(signUp__blockchain({firstName, familyName, typeUser, password}))
    }

    useEffect(()=>{
        dispatch(resetError())
    }, [])

    return(
        <form  className="signUp">
            <p className="signUp__title">SignUp</p>
            <TextField className={"signUp__input"} label="Address Account" variant="standard"
                       value={addressAccount}
                       disabled={true}
            />
            <TextField className={"signUp__input"} label="First Name" variant="outlined"
                       value={firstName}
                       onChange={e => setFirstName(e.target.value)}
            />
            <TextField className={"signUp__input"} label="Family Name" variant="outlined"
                       value={familyName}
                       onChange={e => setFamilyName(e.target.value)}
            />
            <FormControl variant="filled" className={"signUp__select"}>
                <InputLabel id="select-label">Type</InputLabel>
                <Select
                        labelId="select-label"
                        id="demo-simple-select"
                        value={typeUser}
                        label="Type"
                        onChange={e => setTypeUser(e.target.value)}
                >
                    <MenuItem value={TYPE_STUDENT}>Student</MenuItem>
                    <MenuItem value={TYPE_EMPLOYEE}>Employer</MenuItem>
                </Select>
            </FormControl>
            <TextField className={"signUp__input"} label="Password" variant="outlined" type={"password"}
                       value={password}
                       onChange={e => setPassword(e.target.value)}
            />
            <TextField className={"signUp__input"} label="Password Confirm" variant="outlined" type={"password"}
                       value={passwordConfirm}
                       disabled={!password}
                       onChange={e => setPasswordConfirm(e.target.value)}
                       error={errorPassword}
                       helperText={errorPassword ? "The password is not identical" : ""}
            />
            <LoadingButton type={"submit"} loading={loading} variant="contained"
                    className="signUp__btnSignUp"
                    disabled={!addressAccount || !firstName || !familyName || !password || !passwordConfirm}
                    onClick={signUp}
            >Sign Up</LoadingButton>
            {
                error.flag ?
                    <Alert severity="error">{error.message}</Alert>
                    :
                    ""
            }
            <Button
                    className="signUp__btnLogin"
                    onClick={goToLogin}
                    size="small"
            >Login</Button>
        </form>
    )
}