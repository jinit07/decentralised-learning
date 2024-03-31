import React from 'react';
import "./Result.css";
import {useSelector} from "react-redux";
import {selectCertifiedStudents, selectLoadingCertifiedStudents} from "../homeEmployerSlice";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

function Result() {

    const certifiedStudents = useSelector(selectCertifiedStudents);
    const loadingCertifiedStudents = useSelector(selectLoadingCertifiedStudents);

    return (
        <div className="result">
            {
                loadingCertifiedStudents ?
                    <div className="result__loading">
                        <CircularProgress />
                    </div>
                    :
                    certifiedStudents ?
                        certifiedStudents.length === 0 ?
                            <Alert severity="info"> No results found</Alert>
                            :
                            <div className={"result__main"}>
                                <div className="result__main__header">
                                    <p className="result__main__header__number result__main__header__head">N</p>
                                    <p className="result__main__header__firstName result__main__header__head">First Name</p>
                                    <p className="result__main__header__head">Family Name</p>
                                </div>
                                {
                                    certifiedStudents.map((s, i) => (
                                        <div key={i} className="result__main__row">
                                            <p className="result__main__row__number result__main__row__filed">{i+1}</p>
                                            <p className="result__main__row__firstName result__main__row__filed">{s.firstName}</p>
                                            <p className="result__main__row__filed">{s.familyName}</p>
                                            <p className="result__main__row__address">{s.addressAccount}</p>
                                        </div>
                                    ))
                                }
                            </div>
                        :
                        ""


            }
        </div>
    );
}

export default Result;