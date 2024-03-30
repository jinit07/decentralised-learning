import React, {useEffect} from 'react';
import './App.css';
import { Route } from "react-router-dom";
import {Login} from "./features/authentication/login/Login";
import {SignUp} from "./features/authentication/signUp/SignUp";
import Header from "./features/header/Header";
import {Routes} from "react-router";
import Courses from "./features/homeStudent/Courses/Courses";
import Profile from "./features/homeStudent/Profile/Profile";
import {
    URL_ABOUT,
    URL_ADMIN_ADD_COURSE, URL_ADMIN_LIST_COURSES,
    URL_CERTIFICATE,
    URL_EMPLOYER, URL_HOMEPAGE, URL_LOGIN,
    URL_QCM, URL_SIGNUP,
    URL_STUDENT_COURSES,
    URL_STUDENT_COURSES_COURSE,
    URL_STUDENT_PROFILE
} from "./config";
import {AddCourse} from "./features/admin/addCourse/AddCourse";
import Course from "./features/homeStudent/Course/Course";
import Qcm from "./features/homeStudent/Qcm/Qcm";
import HomeEmployer from "./features/homeEmployer/HomeEmployer";
import Certificate from "./features/homeStudent/certificate/Certificate";
import ListCourses from "./features/admin/listCourses/ListCourses";
import AddQcm from "./features/admin/addQcm/AddQcm";
import HomePage from "./features/homePage/HomePage";
import CircularProgress from "@mui/material/CircularProgress";
import {useDispatch, useSelector} from "react-redux";
import {
    getAddressAccount,
    handleLogInFromSessionStorage, selectAddressAccount,
    selectVerifyingUserBlockchain, stopVerifyingUserBlockchain
} from "./features/authentication/authenticationSlice";
import About from "./features/about/About";

function App() {

    const dispatch = useDispatch();
    const addressAccount = useSelector(selectAddressAccount);

    const verifyingUserBlockchain = useSelector(selectVerifyingUserBlockchain);

    useEffect(() => {
        dispatch(getAddressAccount());
    }, [])

    useEffect(() => {
        const userStorage = JSON.parse(sessionStorage.getItem("userBlockchain"));
        if(userStorage !== null){
            if(userStorage.addressAccount === addressAccount){
                delete userStorage["addressAccount"];
                dispatch(handleLogInFromSessionStorage(userStorage));
            }
        }
        setTimeout(()=>{
            dispatch(stopVerifyingUserBlockchain());
        }, 500)
    }, [addressAccount])

    return (
      <>
          {
              verifyingUserBlockchain ?
                  <CircularProgress className={"root__progress"} />
                  :
                  <>
                      <Header />
                      <AddQcm />
                      <div className={"app"}>
                          <Routes>

                              <Route path={URL_HOMEPAGE} element={<HomePage />} />

                              <Route path={URL_LOGIN} element={<Login />} />
                              <Route path={URL_SIGNUP} element={<SignUp />} />

                              <Route path={URL_ADMIN_LIST_COURSES} element={<ListCourses />} />
                              <Route path={URL_ADMIN_ADD_COURSE} element={<AddCourse />} />

                              <Route path={URL_STUDENT_COURSES} element={<Courses />} />
                              <Route path={URL_STUDENT_COURSES_COURSE + "/:idCourse"} element={<Course />} />
                              <Route path={URL_QCM} element={<Qcm />} />
                              <Route path={URL_STUDENT_PROFILE} element={<Profile />} />

                              <Route path={URL_EMPLOYER} element={<HomeEmployer />} />

                              <Route path={URL_CERTIFICATE + "/:idCourse"} element={<Certificate />} />

                              <Route path={URL_ABOUT} element={<About />} />
                          </Routes>
                      </div>
                  </>
          }

      </>
    );
}

export default App;