import React from 'react'
import "./CardCourse.css"
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import IconButton from "@mui/material/IconButton";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import {useNavigate} from "react-router-dom";
import {ROLE_ADMIN, URL_STUDENT_COURSES_COURSE} from "../../config";
import {useDispatch, useSelector} from "react-redux";
import {selectUser} from "../authentication/authenticationSlice";
import HelpIcon from '@mui/icons-material/Help';
import {toggleAddQcm} from "../admin/adminSlice";

function CardCourse({_idCourse, _title, _resume, _urlPdf, _urlImage, _timestamp}) {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const user = useSelector(selectUser);

    const goToCourse = () => {
        navigate(URL_STUDENT_COURSES_COURSE + "/" + _idCourse, {
            state: {
                _idCourse,
                _title,
                _resume,
                _urlPdf,
                _urlImage,
                _timestamp
            }
        })
    }

    return (
        <div className="cardCourse">
            <img className={"cardCourse__img"} src={`https://ipfs.io/ipfs/${_urlImage}`} alt={""} />
            <p className="cardCourse__title">{_title}</p>
            <p className="cardCourse__resume">
                {
                    _resume.length >= 25 ?
                        _resume.substr(0, 25).concat(". . .")
                        :
                        _resume
                }
            </p>
            <div className="cardCourse__links">
                <IconButton className="cardCourse__links__link"
                            variant="contained"
                            color={"success"}
                            size={"small"}
                            onClick={() => {
                                window.open(`https://ipfs.io/ipfs/${_urlPdf}`, "_blank")
                            }}
                >
                    <PictureAsPdfIcon fontSize="inherit" />
                </IconButton>
                {
                    user.role !== ROLE_ADMIN ?
                        <IconButton className="cardCourse__btnDownload"
                                    variant="contained"
                                    color={"secondary"}
                                    size={"small"}
                                    onClick={goToCourse}
                        >
                            <MoreHorizIcon fontSize="inherit" />
                        </IconButton>
                        :
                        <IconButton className="cardCourse__btnDownload"
                                    variant="contained"
                                    color={"secondary"}
                                    size={"small"}
                                    onClick={() => dispatch(toggleAddQcm(_idCourse))}
                        >
                            <HelpIcon fontSize="inherit" />
                        </IconButton>
                }
            </div>
        </div>
    );
}

export default CardCourse;