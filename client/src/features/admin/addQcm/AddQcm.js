import React, {useState} from 'react';
import "./AddQcm.css";
import Modal from "@mui/material/Modal";
import {useDispatch, useSelector} from "react-redux";
import {
    selectErrorUploadQuestionAnswer,
    selectIdCourse,
    selectLoadingUploadQCM,
    selectOpenAddQcm,
    toggleAddQcm,
    uploadQuestionAnswersOfCourse
} from "../adminSlice";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
// import {qcm} from "../../../../public/datas/course_1/course_1_qcm";
import LoadingButton from "@mui/lab/LoadingButton";
import Alert from "@mui/material/Alert";

function AddQcm ()  {

    const dispatch = useDispatch();

    const openAddQcm = useSelector(selectOpenAddQcm);
    const _idCourse = useSelector(selectIdCourse);

    const loadingUploadQCM = useSelector(selectLoadingUploadQCM);
    const errorUploadQuestionAnswer = useSelector(selectErrorUploadQuestionAnswer);

    const [_question, setQuestion] = useState("");

    const [answerText1, setAnswerText1] = useState("");
    const [answerFlag1, setAnswerFlag1] = useState(undefined);

    const [answerText2, setAnswerText2] = useState("");
    const [answerFlag2, setAnswerFlag2] = useState(undefined);

    const [answerText3, setAnswerText3] = useState("");
    const [answerFlag3, setAnswerFlag3] = useState(undefined);

    const [answerText4, setAnswerText4] = useState("");
    const [answerFlag4, setAnswerFlag4] = useState(undefined);

    const [answerText5, setAnswerText5] = useState("");
    const [answerFlag5, setAnswerFlag5] = useState(undefined);

    const submitQuestionAnswers = () => {
        const _answers = [answerText1, answerText2];
        const _flags = [answerFlag1, answerFlag2];
        if(answerText3){
            if(answerFlag3 !== undefined){
                _answers.push(answerText3);
                _flags.push(answerFlag3);
            }
        }
        if(answerText4){
            if(answerFlag4 !== undefined){
                _answers.push(answerText4);
                _flags.push(answerFlag4);
            }
        }
        if(answerText5) {
            if(answerFlag5 !== undefined){
                _answers.push(answerText5);
                _flags.push(answerFlag5);
            }
        }
        dispatch(uploadQuestionAnswersOfCourse({_idCourse, _question, _answers, _flags}));

        setQuestion("");
        setAnswerText1("");
        setAnswerFlag1(undefined);
        setAnswerText2("");
        setAnswerFlag2(undefined)
        setAnswerText3("")
        setAnswerFlag3(undefined);
        setAnswerText4("");
        setAnswerFlag4(undefined);
        setAnswerText5("");
        setAnswerFlag5(undefined);
    }

    // const submitQuestionAnswers = () => {
    //     const _QCM = qcm;
    //     _QCM.forEach((q) => {
    //         const _question = q.question;
    //         const _answers = q.answers;
    //         const _flags = q.flags;
    //         dispatch(uploadQuestionAnswersOfCourse({_idCourse, _question, _answers, _flags}));
    //     })
    // }

    return (
        <Modal
            open={openAddQcm}
            onClose={() => dispatch(toggleAddQcm())}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <form className={"addQcm"}>
                <TextField className={"addQcm__question"} label="Question" variant="outlined" value={_question} onChange={e => setQuestion(e.target.value)} />

                <div className="addQcmM__answer">
                    <TextField className={"addQcm__answer__text"} label="Answer 1" variant="standard" value={answerText1} onChange={e => setAnswerText1(e.target.value)} />
                    {
                        answerText1 ?
                            <FormControl className={"addQcm__answer__flag"} variant="standard">
                                <InputLabel id="select-label-1">Flag</InputLabel>
                                <Select
                                    labelId="select-label-1"
                                    value={answerFlag1}
                                    label="Flag"
                                    onChange={e => setAnswerFlag1(e.target.value)}
                                >
                                    <MenuItem disabled value={undefined}>&nbsp;</MenuItem>
                                    <MenuItem value={false}>False</MenuItem>
                                    <MenuItem value={true}>True</MenuItem>
                                </Select>
                            </FormControl>
                            :
                            ""
                    }
                </div>

                <div className="addQcmM__answer">
                    <TextField className={"addQcm__answer__text"} label="Answer 2" variant="standard" value={answerText2} onChange={e => setAnswerText2(e.target.value)} />
                    {
                        answerText2 ?
                            <FormControl className={"addQcm__answer__flag"} variant="standard">
                                <InputLabel id="select-label-2">Flag</InputLabel>
                                <Select
                                    labelId="select-label-2"
                                    value={answerFlag2}
                                    label="Flag"
                                    onChange={e => setAnswerFlag2(e.target.value)}
                                >
                                    <MenuItem disabled value={undefined}>&nbsp;</MenuItem>
                                    <MenuItem value={false}>False</MenuItem>
                                    <MenuItem value={true}>True</MenuItem>
                                </Select>
                            </FormControl>
                            :
                            ""
                    }
                </div>

                <div className="addQcmM__answer">
                    <TextField className={"addQcm__answer__text"} label="Answer 3" variant="standard" value={answerText3} onChange={e => setAnswerText3(e.target.value)} />
                    {
                        answerText3 ?
                            <FormControl className={"addQcm__answer__flag"} variant="standard">
                                <InputLabel id="select-label-3">Flag</InputLabel>
                                <Select
                                    labelId="select-label-3"
                                    value={answerFlag3}
                                    label="Flag"
                                    onChange={e => setAnswerFlag3(e.target.value)}
                                >
                                    <MenuItem disabled value={undefined}>&nbsp;</MenuItem>
                                    <MenuItem value={false}>False</MenuItem>
                                    <MenuItem value={true}>True</MenuItem>
                                </Select>
                            </FormControl>
                            :
                            ""
                    }
                </div>

                <div className="addQcmM__answer">
                    <TextField className={"addQcm__answer__text"} label="Answer 4" variant="standard" value={answerText4} onChange={e => setAnswerText4(e.target.value)} />
                    {
                        answerText4 ?
                            <FormControl className={"addQcm__answer__flag"} variant="standard">
                                <InputLabel id="select-label-4">Flag</InputLabel>
                                <Select
                                    labelId="select-label-4"
                                    value={answerFlag4}
                                    label="Flag"
                                    onChange={e => setAnswerFlag4(e.target.value)}
                                >
                                    <MenuItem disabled value={undefined}>&nbsp;</MenuItem>
                                    <MenuItem value={false}>False</MenuItem>
                                    <MenuItem value={true}>True</MenuItem>
                                </Select>
                            </FormControl>
                            :
                            ""
                    }
                </div>

                <div className="addQcmM__answer">
                    <TextField className={"addQcm__answer__text"} label="Answer 5" variant="standard" value={answerText5} onChange={e => setAnswerText5(e.target.value)} />
                    {
                        answerText5 ?
                            <FormControl className={"addQcm__answer__flag"} variant="standard">
                                <InputLabel id="select-label-1">Flag</InputLabel>
                                <Select
                                    labelId="select-label-5"
                                    value={answerFlag5}
                                    label="Flag"
                                    onChange={e => setAnswerFlag5(e.target.value)}
                                >
                                    <MenuItem disabled value={undefined}>&nbsp;</MenuItem>
                                    <MenuItem value={false}>False</MenuItem>
                                    <MenuItem value={true}>True</MenuItem>
                                </Select>
                            </FormControl>
                            :
                            ""
                    }
                </div>

                <LoadingButton className="addQCM__submit" variant="contained" loading={loadingUploadQCM}
                        onClick={submitQuestionAnswers}
                        disabled={
                            !_idCourse ||
                            !_question ||
                            !answerText1 || answerFlag1 === undefined ||
                            !answerText2 || answerFlag2 === undefined
                        }
                >Submit</LoadingButton>

                {
                    errorUploadQuestionAnswer.length !== 0 ?
                        <Alert severity="error">{errorUploadQuestionAnswer}!</Alert>
                        :
                        ""
                }
            </form>
        </Modal>
    );
}

export default AddQcm;