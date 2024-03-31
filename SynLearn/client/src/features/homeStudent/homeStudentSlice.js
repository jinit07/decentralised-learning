import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {AuthenticationContractAddress, CoursesContractAddress, thresholdCertification} from "../../config";
import Courses from "../../contracts/Courses.json";
import {ethers} from 'ethers';
import Authentication from "../../contracts/Authentication.json";

const initialState = {
    courses: [],
    loadingCourses: false,
    errorFetchCourses: "",

    qcm: [],
    loadingQcm: false,
    errorFetchQcm: "",

    savingAnswers: false,
    errorSaveAnswers: "",

    qcmPassed: false,
    qcmContinue: false,
    loadingCheckQcmForStudent: false,
    resultQcm : 0,
    savedQcmFlag: false,

    allMyCourses: [],
    loadAllMyCourses: false,
}

async function initialProviderAuthentication () {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(AuthenticationContractAddress, Authentication.abi, signer);
}

async function initialProviderCourses () {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(CoursesContractAddress, Courses.abi, signer);
}

export const fetchCourses = createAsyncThunk(
    'fetchCourses',
    async (_) => {
        if(window.ethereum !== 'undefined'){
            const contractCourses = await initialProviderCourses()
            try{
                const ifCoursesIsEmpty = await contractCourses.ifCoursesIsEmpty()
                if(ifCoursesIsEmpty) return {errorFlag: false, content: []}
                return {errorFlag: false, content: await contractCourses.getCourses()}
            } catch (e) {
                console.log('Error fetch Courses from the blockchain : ', e);
                return {errorFlag: true, content: "Error fetch Courses from the blockchain !"}
            }
        }
    }
)

export const fetchQcmOfCourse = createAsyncThunk(
    'fetchQcmOfCourse',
    async (_idCourse) => {
        if(window.ethereum !== 'undefined'){
            const contractAuthentication = await initialProviderAuthentication()
            const contractCourses = await initialProviderCourses()
            try{
                // Get questions from course contract
                const _questions = await contractCourses.getQuestionsOfCourse(_idCourse);
                if(_questions.length === 0) return {errorFlag: true, content: `There is no questions for course ${_idCourse}`};
                // Check if course exists for the student
                const courseExists = await contractAuthentication.ifCourseExistsForStudent(_idCourse);
                // My QCM
                let _qcm = [];
                // Where the QCM should continue : 0 or when the student stopped the last time passing the QCM
                let _indexBegin;
                if(!courseExists) {
                    _indexBegin = 0;
                } else {
                    const _questionsAnswersOfStudent = await contractAuthentication.getQuestionsAnswersOfCourseForStudent(_idCourse);
                    // console.log(_questionsAnswersOfStudent.length)
                    _indexBegin = _questionsAnswersOfStudent.length;
                }
                // Fill the My QCM and don't forget to save the indexQuestion for each question
                for(let _indexQuestion = _indexBegin; _indexQuestion < _questions.length; _indexQuestion++){
                    const _answers = await contractCourses.getAnswersOfQuestion(_idCourse, _indexQuestion);
                    if(_answers.length === 0) return {errorFlag: true, content: `There is no answers for the question ${_indexQuestion} of course ${_idCourse}`};
                    _qcm.push({question: _questions[_indexQuestion], answers: _answers, indexQuestion: _indexQuestion});
                }
                return {errorFlag: false, content: _qcm};
            } catch (e) {
                console.log('Error fetch QCM : ', e);
                return {errorFlag: true, content: "Error fetch QCM !"};
            }
        }
    }
)

export const saveAnswersToStudent = createAsyncThunk(
    'saveAnswersToStudent',
    async ({_addressAccount, _idCourse, _idQuestions, _idAnswers}) => {
        if(_idQuestions.length === 0 || _idAnswers.length === 0)
            return {errorFlag: true, content: "No answer available to save, please repeat the MCQ !"};
        if(window.ethereum !== 'undefined'){
            const contractAuthentication = await initialProviderAuthentication();
            const contractCourses = await initialProviderCourses();
            try{
                const _questions = await contractCourses.getQuestionsOfCourse(_idCourse);
                const _questionsAnswersStudent = await contractAuthentication.getQuestionsAnswersOfCourseForStudent(_idCourse);
                const _myQuestionsAnswersStudent = [..._questionsAnswersStudent];
                for(let k = 0; k < _idQuestions.length; k++){
                    _myQuestionsAnswersStudent.push({idQuestion: _idQuestions[k], idAnswer: _idAnswers[k]});
                }
                let _totalRightAnswer = 0;
                for(let _indexQuestion = 0; _indexQuestion < _myQuestionsAnswersStudent.length; _indexQuestion++){
                    const _answers = await contractCourses.getAnswersOfQuestion(_idCourse, _myQuestionsAnswersStudent[_indexQuestion].idQuestion);
                    if(_answers[_myQuestionsAnswersStudent[_indexQuestion].idAnswer].flag) _totalRightAnswer++;
                }
                const progress = parseFloat(_totalRightAnswer * 100 / _questions.length).toFixed(2);
                if(progress !== 0){
                    await contractAuthentication.addNewCourseToStudent(_idCourse, _idQuestions, _idAnswers);
                    if(progress >= thresholdCertification){
                        await contractCourses.addAddressCertifiedStudent(_idCourse, _addressAccount);
                    }
                }
                return {errorFlag: false, content: progress};
            } catch (e) {
                console.log('Error save answers : ', e);
                return {errorFlag: true, content: "Blockchain : Error Error save answers !"}
            }
        }
    }
)

export const checkIfQcmOfCoursePassed = createAsyncThunk(
    'checkIfQcmOfCoursePassed',
    async (_idCourse) => {
        if(window.ethereum !== 'undefined'){
            const contractAuthentication = await initialProviderAuthentication();
            const contractCourses = await initialProviderCourses();
            try{
                const _questions  = await contractCourses.getQuestionsOfCourse(_idCourse);
                const _courseExists = await contractAuthentication.ifCourseExistsForStudent(_idCourse);
                if(_courseExists){
                    const _questionsAnswersOfStudent = await contractAuthentication.getQuestionsAnswersOfCourseForStudent(_idCourse);
                    if(_questions.length === _questionsAnswersOfStudent.length) return {errorFlag: false, content: {pass: true, continue: false}};
                    else return {errorFlag: false, content: {pass: false, continue: true}};
                }
                return {errorFlag: false, content: {pass: false, continue: false}};
            } catch (e) {
                console.log('Error check if QCM is passed : ', e);
                return {errorFlag: true, content: "Blockchain : Error check if QCM is passed !"}
            }
        }
    }
)

export const getAllMyCourses = createAsyncThunk(
    'getAllMyCourses',
    async () => {
        if(window.ethereum !== 'undefined'){
            const contractAuthentication = await initialProviderAuthentication();
            const contractCourses = await initialProviderCourses();
            try{
                const _idCourses = await contractAuthentication.getIdCoursesOfStudent();
                if(_idCourses.length === 0) return {errorFlag: false, content: []};
                let _allMyCourses = [];
                for(let _indexCourse = 0; _indexCourse < _idCourses.length; _indexCourse++){
                    const _course = await contractCourses.getCourseById(_idCourses[_indexCourse]);
                    const _questions  = await contractCourses.getQuestionsOfCourse(_idCourses[_indexCourse]);
                    const _questionsAnswersStudent = await contractAuthentication.getQuestionsAnswersOfCourseForStudent(_idCourses[_indexCourse]);
                    let _totalRightAnswer = 0;
                    for(let _indexAnswer = 0; _indexAnswer < _questionsAnswersStudent.length; _indexAnswer++){
                        const _answers = await contractCourses.getAnswersOfQuestion(_idCourses[_indexCourse], _questionsAnswersStudent[_indexAnswer].idQuestion);
                        if(_answers[_questionsAnswersStudent[_indexAnswer].idAnswer].flag) _totalRightAnswer++;
                    }
                    _allMyCourses.push({
                        idCourse: _course.idCourse,
                        title: _course.title,
                        resume: _course.resume,
                        urlPdf: _course.urlPdf,
                        urlImage: _course.urlImage,
                        timestamp: _course.timestamp,
                        progress: parseFloat(_totalRightAnswer * 100 / _questions.length).toFixed(2),
                    })
                }
                console.log(_allMyCourses);
                return {errorFlag: false, content: _allMyCourses};
            } catch (e) {
                console.log('Error check if QCM is passed : ', e);
                return {errorFlag: true, content: "Blockchain : Error check if QCM is passed !"}
            }
        }
    }
)

export const homeStudentSlice = createSlice({
    name: 'homeStudent',
    initialState,
    reducers: {
        turnFalseSavedQcmFlag: state => {
            state.savedQcmFlag = false;
        }
    },
    extraReducers: {
        // Fetch Courses ------------------------------------------------------------------------------------------
        [fetchCourses.pending] : state => {
            state.courses = [];
            state.errorFetchCourses = "";
            state.loadingCourses = true;
        },
        [fetchCourses.fulfilled] : (state, action) => {
            if(action.payload.errorFlag) state.errorFetchCourses = action.payload.content;
            else state.courses = action.payload.content;
            state.loadingCourses = false;
        },
        [fetchCourses.rejected] : (state, action) => {
            state.errorFetchCourses = action.payload.content;
            state.loadingCourses = false;
        },
        // Fetch QCM -----------------------------------------------------------------------------------------------
        [fetchQcmOfCourse.pending] : state => {
            state.loadingQcm = true;
            state.errorFetchQcm = "";
            state.qcm = [];
        },
        [fetchQcmOfCourse.fulfilled] : (state, action) => {
            if(action.payload.errorFlag) state.errorFetchQcm = action.payload.content;
            else{
                state.qcm = action.payload.content;
            }
            state.loadingQcm = false;
        },
        [fetchQcmOfCourse.rejected] : (state, action) => {
            state.errorFetchQcm = action.payload;
            state.loadingQcm = false;
        },
        // Save Answers ------------------------------------------------------------------------------------------
        [saveAnswersToStudent.pending] : state => {
            state.errorSaveAnswers = "";
            state.savingAnswers = true;
            state.resultQcm = 0;
            state.savedQcmFlag = false;
        },
        [saveAnswersToStudent.fulfilled] : (state, action) => {
            if(action.payload.errorFlag) state.errorSaveAnswers = action.payload.content;
            else {
                state.resultQcm = action.payload.content;
                state.savedQcmFlag = true;
            }
            state.savingAnswers = false;
        },
        [saveAnswersToStudent.rejected] : (state, action) => {
            state.errorSaveAnswers = action.payload.content;
            state.savingAnswers = false;
            state.savedQcmFlag = false;
        },
        // Check if QCM is passed or if we have to continue ------------------------------------------------------
        [checkIfQcmOfCoursePassed.pending]: state => {
            state.loadingCheckQcmForStudent = true;
        },
        [checkIfQcmOfCoursePassed.fulfilled]: (state, action) => {
            if(!action.errorFlag){
                state.qcmPassed = action.payload.content.pass;
                state.qcmContinue = action.payload.content.continue;
            }
            state.loadingCheckQcmForStudent = false;
        },
        [checkIfQcmOfCoursePassed.rejected]: (state, action) => {
            state.loadingCheckQcmForStudent = false;
        },
        // All My Courses -----------------------------------------------------------------------------------
        [getAllMyCourses.pending] : state => {
            state.loadAllMyCourses = true;
            state.allMyCourses = [];
        },
        [getAllMyCourses.fulfilled] : (state, action) => {
            console.log(action.payload)
            if(!action.payload.errorFlag){
                state.allMyCourses = action.payload.content;
            }
            state.loadAllMyCourses = false;
        },
        [getAllMyCourses.rejected] : (state, action) => {
            state.loadAllMyCourses = false;
        },
    },
});

export const {turnFalseSavedQcmFlag} = homeStudentSlice.actions;

export const selectCourses = state => state.homeStudent.courses;
export const selectLoadingCourses = state => state.homeStudent.loadingCourses;
export const selectErrorFetchCourses = state => state.homeStudent.errorFetchCourses;

export const selectQcm = state => state.homeStudent.qcm;
export const selectLoadingQcm = state => state.homeStudent.loadingQcm;
export const selectErrorFetchQcm = state => state.homeStudent.errorFetchQcm;

export const selectSavingAnswers = state => state.homeStudent.savingAnswers;
export const selectErrorSaveAnswers = state => state.homeStudent.errorSaveAnswers;

export const selectQcmPassed = state => state.homeStudent.qcmPassed;
export const selectQcmContinue = state => state.homeStudent.qcmContinue;
export const selectLoadingCheckQcmForStudent = state => state.homeStudent.loadingCheckQcmForStudent;
export const selectResultQcm = state => state.homeStudent.resultQcm;
export const selectSavedQcmFlag = state => state.homeStudent.savedQcmFlag;

export const selectAllMyCourses = state => state.homeStudent.allMyCourses;
export const selectLoadAllMyCourses = state => state.homeStudent.loadAllMyCourses;


export default homeStudentSlice.reducer;
