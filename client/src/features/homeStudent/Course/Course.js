import React, {useEffect, useState} from 'react';
import "./Course.css";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import {useLocation, useNavigate} from "react-router-dom";
import {URL_QCM} from "../../../config";
import {useDispatch, useSelector} from "react-redux";
import {
    checkIfQcmOfCoursePassed,
    selectLoadingCheckQcmForStudent,
    selectQcmContinue,
    selectQcmPassed
} from "../homeStudentSlice";
import LoadingButton from "@mui/lab/LoadingButton";
import CircularProgress from "@mui/material/CircularProgress";


function Course() {

    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const qcmPassed = useSelector(selectQcmPassed);
    const qcmContinue = useSelector(selectQcmContinue);
    const loadingCheckQcmForStudent = useSelector(selectLoadingCheckQcmForStudent);

    const [course, setCourse] = useState({});
    const [loadCourse, setLoadCourse] = useState(true);

    useEffect(() => {
        setLoadCourse(true);
        setCourse({
            idCourse: location.state._idCourse,
            title: location.state._title,
            resume: location.state._resume,
            urlPdf: location.state._urlPdf,
            urlImage: location.state._urlImage,
            timestamp: location.state._timestamp
        });
        dispatch(checkIfQcmOfCoursePassed(location.state._idCourse));
        setLoadCourse(false);
    }, [])

    return (
        <div className="course">
            {
                loadCourse ?
                    <div className="course__loading">
                        <CircularProgress />
                    </div>
                    :
                    course.length === 0 ?
                        <Alert severity="warning">No Course selected !</Alert>
                        :
                        <>
                            <img src={`https://ipfs.io/ipfs/${course.urlImage}`} alt="" className={"course__img"}/>
                            <p className="course__title">{course.title}</p>
                            <p className="course__resume">{course.resume}</p>
                            <div className="course__links">
                                <Button variant="contained"
                                        endIcon={<PictureAsPdfIcon />}
                                        className={"course__links__link"}
                                        onClick={() => {
                                            window.open(`https://ipfs.io/ipfs/${course.urlPdf}`, "_blank")
                                        }}
                                >
                                    Download PDF
                                </Button>
                                {
                                    !qcmPassed ?
                                        <LoadingButton
                                            variant="contained"
                                            loading={loadingCheckQcmForStudent}
                                            endIcon={<QuestionAnswerIcon />}
                                            className={"course__links__link"}
                                            color={"success"}
                                            onClick={() =>
                                                navigate(URL_QCM, {
                                                    state: {
                                                        _idCourse: course.idCourse,
                                                        _title: course.title
                                                    }
                                                })
                                            }
                                        >
                                            {
                                                qcmContinue ?
                                                    "Continue "
                                                    :
                                                    "Pass "
                                            }
                                            the QCM
                                        </LoadingButton>
                                        :
                                        <Alert severity="info">You have already taken this MCQ !</Alert>
                                }

                            </div>
                        </>
            }
        </div>
    );
}

export default Course;