import React, {useEffect, useRef, useState} from 'react'
import "./Header.css"
import {useDispatch, useSelector} from "react-redux";
import {
    clearMyInterval,
    handleLogOut, selectAddressAccount,
    selectConnected,
    selectUser
} from "../authentication/authenticationSlice";
import Button from "@mui/material/Button";
import {useLocation, useNavigate} from "react-router-dom";
import {
    platformAcronym, ROLE_ADMIN,
    TYPE_EMPLOYEE,
    TYPE_STUDENT, URL_ABOUT,
    URL_ADMIN_ADD_COURSE, URL_ADMIN_LIST_COURSES,
    URL_EMPLOYER, URL_HOMEPAGE, URL_LOGIN, URL_SIGNUP,
    URL_STUDENT_COURSES,
    URL_STUDENT_PROFILE
} from "../../config";
import {toggleOpenSearch} from "../homeEmployer/homeEmployerSlice";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import HandshakeIcon from '@mui/icons-material/Handshake';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import ContactsIcon from '@mui/icons-material/Contacts';
import LoginIcon from '@mui/icons-material/Login';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LogoutIcon from '@mui/icons-material/Logout';
import ContactPageIcon from '@mui/icons-material/ContactPage';

function Header() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation()

    const user = useSelector(selectUser);
    const connected = useSelector(selectConnected);
    const addressAccount = useSelector(selectAddressAccount);

    const refCourses = useRef();
    const refProfile = useRef();
    const refAddCourse = useRef();
    const refListCourses = useRef();

    useEffect(() => {
        if(location.pathname !== URL_HOMEPAGE) dispatch(clearMyInterval());
    }, [location.pathname])

    useEffect(() => {
        if(!connected) {
            navigate(URL_HOMEPAGE);
            return;
        }
        if(user.role === ROLE_ADMIN){
            refListCourses.current.classList.add("header__nav__option__selected");
            navigate(URL_ADMIN_LIST_COURSES);

        }else{
            if(user.typeUser === TYPE_EMPLOYEE) navigate(URL_EMPLOYER);
            else {
                refCourses.current.classList.add("header__nav__option__selected");
                navigate(URL_STUDENT_COURSES);
            }
        }
    }, [connected, addressAccount])

    const goToHomePage = () => {
        const elem = document.querySelector(".header__nav__option__selected");
        if(elem !== undefined && elem !== null) elem.classList.remove("header__nav__option__selected");
        navigate(URL_HOMEPAGE);
    }
    const goToListCoursesAdmin = () => {
        refAddCourse.current.classList.remove("header__nav__option__selected");
        refListCourses.current.classList.add("header__nav__option__selected");
        navigate(URL_ADMIN_LIST_COURSES);
    }
    const goToAddCourse = () => {
        refListCourses.current.classList.remove("header__nav__option__selected");
        refAddCourse.current.classList.add("header__nav__option__selected");
        navigate(URL_ADMIN_ADD_COURSE);
    }
    const goToCourses = () => {
        refProfile.current.classList.remove("header__nav__option__selected");
        refCourses.current.classList.add("header__nav__option__selected");
        navigate(URL_STUDENT_COURSES);
    }

    const goToProfile = () => {
        refCourses.current.classList.remove("header__nav__option__selected");
        refProfile.current.classList.add("header__nav__option__selected");
        navigate(URL_STUDENT_PROFILE);
    }

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleOpenMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    return (
        <div className="header">
            <div className="header__title" onClick={goToHomePage}>
                <img className={"header__title__logo"} src={"../logo-white.png"} alt={""} />
                <p className="header__title__text">{platformAcronym}</p>
            </div>
            {
                connected ?
                    <div className="header__nav">
                        {
                            user.role === ROLE_ADMIN ?
                                <>
                                    <p ref={refAddCourse} className="header__nav__option" onClick={goToAddCourse}>Add Course</p>
                                    <p ref={refListCourses} className="header__nav__option" onClick={goToListCoursesAdmin}>List Courses</p>
                                </>
                                :
                                user.typeUser === TYPE_STUDENT ?
                                    <>
                                        <p ref={refCourses} className="header__nav__option" onClick={goToCourses}>Courses</p>
                                        <p ref={refProfile} className="header__nav__option" onClick={goToProfile}>Profile</p>
                                    </>
                                    :
                                    user.typeUser === TYPE_EMPLOYEE ?
                                        <p className="header__nav__option" onClick={() => dispatch(toggleOpenSearch())}>Search</p>
                                        :
                                        ""


                        }
                    </div>
                    :
                    ""
            }

            <div className="header__user">
                {
                    connected ?
                        <>
                            <div className="header__user__information">
                                {
                                    user.firstName.length !== 0 ?
                                        <p className="header__user__information__firstName">{user.firstName}</p>
                                        :
                                        ""
                                }
                                <p className="header__user__information__familyName">{String(user.familyName).toUpperCase()}</p>
                            </div>
                            <Button
                                className={"header__user__btn header__user__btnLogOut"}
                                onClick={() => dispatch(handleLogOut())}
                                startIcon={<LogoutIcon/>}
                                size="small"
                            >Log Out</Button>
                        </>
                        :
                        <>
                            <Button
                                className={"header__user__btn header__user__btnLogIn"}
                                onClick={() => navigate(URL_LOGIN)}
                                startIcon={<LoginIcon />}
                                size="small"
                            >Log In</Button>
                            <Button
                                className={"header__user__btn header__user__btnSignUp"}
                                onClick={() => navigate(URL_SIGNUP)}
                                startIcon={<AssignmentIcon />}
                                size="small"
                            >Sign Up</Button>
                        </>
                }
                <Button className={"header__user__btn header__user__btnContactUs"}
                        onClick={() => navigate(URL_ABOUT)}
                        startIcon={<ContactPageIcon />}
                        size="small"
                >About Us</Button>
                {/*<IconButton*/}
                {/*    id="basic-button"*/}
                {/*    aria-controls={open ? 'basic-menu' : undefined}*/}
                {/*    aria-haspopup="true"*/}
                {/*    aria-expanded={open ? 'true' : undefined}*/}
                {/*    onClick={handleOpenMenu}*/}
                {/*    className={"header__user__btn"}*/}
                {/*>*/}
                {/*    <MenuIcon />*/}
                {/*</IconButton>*/}
            </div>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleCloseMenu}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
                className={"header__menu"}
            >
                <MenuItem onClick={handleCloseMenu}>
                    <AccountTreeIcon style={{"marginRight": "10px"}} fontSize={"small"}/>
                    <span className={"header__menu__item__text"}>Our Programs</span>
                </MenuItem>
                <MenuItem onClick={handleCloseMenu}>
                    <HandshakeIcon style={{"marginRight": "10px"}} fontSize={"small"}/>
                    <span className={"header__menu__item__text"}>Our Partners</span>
                </MenuItem>
                <MenuItem onClick={handleCloseMenu}>
                    <ContactsIcon style={{"marginRight": "10px"}} fontSize={"small"}/>
                    <span className={"header__menu__item__text"}>Contact Us</span>
                </MenuItem>
            </Menu>
        </div>
    );
}

export default Header;