import React, {useEffect} from 'react'
import "./Courses.css"
import {useDispatch, useSelector} from "react-redux";
import {
    fetchCourses,
    selectCourses,
    selectErrorFetchCourses,
    selectLoadingCourses
} from "../homeStudentSlice";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import CardCourse from "../../CardCourse/CardCourse";

function Courses() {

    const dispatch = useDispatch()

    const courses = useSelector(selectCourses)
    const loadingCourses = useSelector(selectLoadingCourses)
    const errorFetchCourses = useSelector(selectErrorFetchCourses)

    useEffect(() => {
        dispatch(fetchCourses())
    }, [])

    return (
        <div className={`courses ${courses ? courses.length === 0 ? "courses__empty" : "" : ""}`}>
            {
                loadingCourses ?
                    <div className="courses__loading">
                        <CircularProgress />
                    </div>
                    :
                    courses ?
                        courses.length !== 0 ?
                            <>
                                {
                                    courses.map(c => (
                                        <CardCourse
                                            key={c.idCourse}
                                            _title={c.title}
                                            _idCourse={c.idCourse}
                                            _resume={c.resume}
                                            _urlPdf={c.urlPdf}
                                            _urlImage={c.urlImage}
                                            _timestamp={c.timestamp}
                                            _questionsAnswers={c.questionsAnswers}
                                        />
                                    ))
                                }
                            </>
                            :
                            <Alert severity="info">There is no Courses yet !</Alert>
                        :
                        errorFetchCourses.length === 0 ?
                            <Alert severity="error">{errorFetchCourses}</Alert>
                            :
                            "ERROR BAGHDAD !"
            }
        </div>
    );
}

export default Courses;