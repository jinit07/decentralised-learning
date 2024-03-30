import React, {useEffect} from 'react';
import "./ListCourses.css";
import {useDispatch, useSelector} from "react-redux";
import {
    fetchListCourses,
    selectListCourses,
    selectLoadingListCourses,
    toggleAddQcm,
} from "../adminSlice";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import CodeIcon from "@mui/icons-material/Code";
import IconButton from "@mui/material/IconButton";
import CardCourse from "../../CardCourse/CardCourse";

function ListCourses() {

    const dispatch = useDispatch();

    const listCourses = useSelector(selectListCourses);
    const loadingListCourses = useSelector(selectLoadingListCourses);

    useEffect(() => {
        dispatch(fetchListCourses());
    }, [])

    return (
        <div className={"listCourses"}>
            {
                loadingListCourses ?
                    <CircularProgress />
                    :
                    listCourses ?
                        listCourses.length === 0 ?
                            <div className="listCourses__empty">
                                <Alert className={"listCourses__empty"} severity="info">No courses available !</Alert>
                            </div>
                            :
                            listCourses.map((course,i) => (
                               <CardCourse key={i}
                                           _timestamp={course.timestamp}
                                           _title={course.title}
                                           _urlImage={course.urlImage}
                                           _urlPdf={course.urlPdf}
                                           _resume={course.resume}
                                           _idCourse={course.idCourse}
                                />
                            ))
                        :
                        ""

            }
        </div>
    );
}

export default ListCourses;