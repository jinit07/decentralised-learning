import React, {useEffect, useState} from 'react';
import "./Qcm.css";
import {useLocation, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {
    fetchQcmOfCourse,
    saveAnswersToStudent,
    selectErrorFetchQcm, selectErrorSaveAnswers,
    selectLoadingQcm,
    selectQcm, selectResultQcm, selectSavedQcmFlag, selectSavingAnswers, turnFalseSavedQcmFlag
} from "../homeStudentSlice";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Button from "@mui/material/Button";
import Modal, {modalClasses} from "@mui/material/Modal";
import Box from "@mui/material/Box";
import AlertTitle from "@mui/material/AlertTitle";
import {selectAddressAccount, selectUser} from "../../authentication/authenticationSlice";
import {thresholdCertification, URL_CERTIFICATE} from "../../../config";

function Qcm() {

    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector(selectUser);
    const addressAccount = useSelector(selectAddressAccount);
    const qcm = useSelector(selectQcm);
    const loadingQcm = useSelector(selectLoadingQcm);
    const errorFetchQcm = useSelector(selectErrorFetchQcm);

    const savingAnswers = useSelector(selectSavingAnswers);
    const errorSaveAnswers = useSelector(selectErrorSaveAnswers);

    const resultQcm = useSelector(selectResultQcm);
    const savedQcmFlag = useSelector(selectSavedQcmFlag);

    const [indexQuestion, setIndexQuestion] = useState(0);
    const [indexAnswer, setIndexAnswer] = useState(null);
    const [idQuestions, setIdQuestions] = useState([]);
    const [idAnswers, setIdAnswers] = useState([]);
    const [openResultQcm, setOpenResultQcm] = useState(false);

    useEffect(() => {
        dispatch(fetchQcmOfCourse(location.state._idCourse))
    }, [])

    const nextQuestion = () => {
        setIdQuestions([...idQuestions, qcm[indexQuestion].indexQuestion])
        setIdAnswers([...idAnswers, parseInt(indexAnswer)])
        setIndexQuestion(indexQuestion + 1)
        setIndexAnswer(null)
    }

    const saveAnswers = () => {
        setIdQuestions([...idQuestions, qcm[indexQuestion].indexQuestion])
        setIdAnswers([...idAnswers, parseInt(indexAnswer)])
        dispatch(saveAnswersToStudent({
            _addressAccount: addressAccount,
            _idCourse: location.state._idCourse,
            _idQuestions: [...idQuestions, qcm[indexQuestion].indexQuestion],
            _idAnswers: [...idAnswers, parseInt(indexAnswer)]
        }));
    }

    const cancelQcm = () => {
        if(idQuestions.length === 0) navigate(-1)
        else {
            if(idQuestions.length !== 0 && idAnswers.length !== 0){
                dispatch(saveAnswersToStudent({
                    _addressAccount: addressAccount,
                    _idCourse: location.state._idCourse,
                    _idQuestions: idQuestions,
                    _idAnswers: idAnswers
                }));
            }
        }
    }

    useEffect(() => {
        if(savedQcmFlag) {
            setOpenResultQcm(true);
        }
    }, [savedQcmFlag]);

    const handleCloseResult = () => {
        setOpenResultQcm(false);
        dispatch(turnFalseSavedQcmFlag());
        navigate(-1);
    }

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        // border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    return (
        <div className="qcm">
            {
                loadingQcm ?
                    <CircularProgress color="success" />
                    :
                    errorFetchQcm.length !== 0 ?
                        <Alert severity="error">{errorFetchQcm} !</Alert>
                        :
                        qcm.length === 0 ?
                            <Alert severity="warning">There is no QCM for this course</Alert>
                            :
                            <>
                                <p className="qcm__title">QCM : {location.state._title}</p>
                                <div className="qcm__main">
                                    {
                                        savingAnswers ?
                                            <div className="qcm__progress__saveAnswers">
                                                <CircularProgress />
                                            </div>
                                            :
                                            ""
                                    }
                                    {/*<p className="qcm__main__counter">{indexQuestion + 1}</p>*/}
                                    <p className="qcm__main__question">{qcm[indexQuestion].question} ?</p>
                                    <RadioGroup
                                        className={"qcm__main__answers"}
                                        value={indexAnswer}
                                        onChange={e => setIndexAnswer(e.target.value)}
                                    >
                                        {
                                            qcm[indexQuestion].answers.map((answer, indexAnswer) => (
                                                <FormControlLabel value={indexAnswer} control={<Radio />} label={answer.text} />
                                            ))
                                        }
                                    </RadioGroup>
                                    <div className="qcm__main__btn">
                                        <Button className="qcm__main__btnCancel"
                                                // disabled={!indexAnswer}
                                                variant="outlined"
                                                onClick={cancelQcm}
                                        >Cancel</Button>
                                        {
                                            indexQuestion < qcm.length - 1 ?
                                                <Button className="qcm__main__btnNext"
                                                        onClick={nextQuestion}
                                                        disabled={!indexAnswer}
                                                        variant="contained"
                                                >Next</Button>
                                                :
                                                <Button className="qcm__main__btnSubmit"
                                                        disabled={!indexAnswer}
                                                        variant="contained"
                                                        onClick={saveAnswers}
                                                >Submit</Button>
                                        }
                                    </div>
                                </div>
                                {
                                    errorSaveAnswers.length !== 0 ?
                                        <Alert severity="error">{errorSaveAnswers} !</Alert>
                                        :
                                        ""
                                }

                            </>
            }
            <Modal
                open={openResultQcm}
                onClose={handleCloseResult}
            >
                <div className={"qcm__notification"}>
                    {
                        resultQcm < thresholdCertification ?
                            <Alert severity="info" className={"qcm__notification__info"}>
                                <AlertTitle>Result</AlertTitle>
                                Your score is : <strong>{resultQcm} %</strong>
                            </Alert>
                            :
                            <Alert severity="success" className={"qcm__notification__success"} size="small">
                                <AlertTitle>Result</AlertTitle>
                                Your score is : <strong>{resultQcm} %</strong>
                                <Button variant="contained"
                                        className={"qcm__notification__success__btnCertification"}
                                        color="success"
                                        onClick={()=>navigate(URL_CERTIFICATE + "/" + location.state._idCourse,{
                                            state:{
                                                firstName: user.firstName,
                                                familyName: user.familyName,
                                                titleCourse: location.state._title,
                                                addressAccount: addressAccount
                                            },
                                            replace: true
                                        })}
                                >
                                    View my certificate
                                </Button>
                            </Alert>
                    }

                </div>
            </Modal>
        </div>
    );
}

export default Qcm;