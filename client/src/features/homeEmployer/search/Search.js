import React, {useEffect, useState} from 'react';
import "./Search.css";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import {useDispatch, useSelector} from "react-redux";
import {fetchCertifiedStudents, selectOpenSearch, setDashboard, toggleOpenSearch} from "../homeEmployerSlice";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import Button from "@mui/material/Button";
import {ethers} from "ethers";
import {CoursesContractAddress} from "../../../config";
import Courses from "../../../contracts/Courses.json";

function Search() {

    const dispatch = useDispatch();

    const openSearch = useSelector(selectOpenSearch);

    const [courses, setCourses] = useState([]);

    const [idCourse, setIdCourse] = useState(undefined);
    const [firstName, setFirstName] = useState("");
    const [familyName, setFamilyName] = useState("");

    async function initialProviderCourses () {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        return new ethers.Contract(CoursesContractAddress, Courses.abi, signer);
    }

    async function uploadCourses() {
        const contractCourses = await initialProviderCourses();
        const ifCoursesIsEmpty = await contractCourses.ifCoursesIsEmpty();
        if(!ifCoursesIsEmpty){
            setCourses(await contractCourses.getCourses());
        }
    }

    useEffect(() => {
        uploadCourses();
    }, [])

    const handleSearch = e => {
        e.preventDefault();
        dispatch(setDashboard({
            titleCourse: courses[idCourse].title,
            firstName,
            familyName
        }))
        dispatch(fetchCertifiedStudents({
            _idCourse: idCourse,
            _firstName: firstName,
            _familyName: familyName
        }))
        setIdCourse(undefined);
        setFirstName("");
        setFamilyName("");
        dispatch(toggleOpenSearch());
    }

    const closeSearch = () => {
        dispatch(setDashboard({}));
        dispatch(toggleOpenSearch());
    }

    return (
        <Modal
            open={openSearch}
            onClose={closeSearch}
        >
            <form className={"search"}>
                <FormControl className={"search__select"}>
                    <InputLabel id="select-label-courses">Courses</InputLabel>
                    <Select
                        labelId="select-label-courses"
                        value={idCourse ? idCourse : ""}
                        label="Courses"
                        onChange={e => setIdCourse(e.target.value)}>
                        {
                            courses ?
                                courses.length !== 0 ?
                                    courses.map((course, index) => (
                                        <MenuItem key={index} value={course.idCourse}>{course.title}</MenuItem>
                                    ))
                                    :
                                    <MenuItem disabled><i>No courses available</i></MenuItem>
                                :
                                <MenuItem disabled><i>No courses available</i></MenuItem>
                        }
                    </Select>
                    <FormHelperText>
                        {
                            idCourse ?
                                `Id Course : ${idCourse}`
                                :
                                "Required"
                        }
                    </FormHelperText>
                </FormControl>
                <TextField
                    label="First Name"
                    variant="outlined"
                    className={"search__input"}
                    disabled={!idCourse}
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                />
                <TextField
                    label="Family Name"
                    variant="outlined"
                    className={"search__input"}
                    disabled={!idCourse || !firstName}
                    value={familyName}
                    onChange={e => setFamilyName(e.target.value)}
                />
                <Button
                    type={"submit"}
                    variant="contained"
                    className={"search__button"}
                    disabled={!idCourse || firstName.length < 3 || familyName.length < 3}
                    onClick={handleSearch}
                >Search</Button>
            </form>
        </Modal>
    );
}

export default Search;