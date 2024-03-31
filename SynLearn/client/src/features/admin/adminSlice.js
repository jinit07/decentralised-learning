import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {CoursesContractAddress} from "../../config"
import {ethers} from 'ethers'
import {create} from 'ipfs-http-client'
import Courses from "../../contracts/Courses.json";

const initialState = {
    errorUploadCourse: "",
    loadingUploadCourse: false,

    errorUploadQuestionAnswer: "",
    loadingUploadQCM: false,

    listCourses: [],
    loadingListCourses: false,

    openAddQcm: false,
    idCourse: null,
}

async function initialProviderCourses () {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(CoursesContractAddress, Courses.abi, signer);
}

export const fetchListCourses = createAsyncThunk(
    'fetchListCourses',
    async () => {
        if(window.ethereum !== 'undefined'){
            const contractCourses = await initialProviderCourses();
            try{
                const ifCoursesIsEmpty = await contractCourses.ifCoursesIsEmpty()
                if(ifCoursesIsEmpty) return {errorFlag: false, content: []};
                const response = await contractCourses.getCourses();
                let _listCourses = [];
                for(let i = 0; i < response.length; i++){
                    _listCourses.push(response[i]);
                }
                return {errorFlag: false, content: _listCourses}
            } catch (e) {
                console.log('Error fetch list courses : ', e);
                return {errorFlag: true, content: "Error fetch list courses !"}
            }
        }
    }
)
export const uploadCourseToBlockchain = createAsyncThunk(
    "uploadCourseToBlockchain",
    async ({ _title, _resume, _ipfsLink }) => {
      if (window.ethereum !== "undefined") {
        const contractCourses = await initialProviderCourses();
        try {
          // Here, instead of uploading the PDF to IPFS, we directly use the provided IPFS link
          await contractCourses.newCourse(_title, _resume, _ipfsLink, _ipfsLink);
          return { errorFlag: false, content: "" };
        } catch (e) {
          console.log("Error add course : ", e);
          return { errorFlag: true, content: "Error add Course to blockchain !" };
        }
      }
      return { errorFlag: true, content: "window.ethereum is undefined !" };
    }
);
  

export const uploadQuestionAnswersOfCourse = createAsyncThunk(
    'uploadQuestionAnswersOfCourse',
    async ({_idCourse, _question, _answers, _flags}) => {
        if(window.ethereum !== 'undefined'){
            const contractCourses = await initialProviderCourses()
            try{
                await contractCourses.addQuestionWithAnswersToCourse(_idCourse, _question, _answers, _flags)
                return {errorFlag: false, content: ""}
            } catch (e) {
                console.log('Error add Question Answers : ', e);
                return {errorFlag: true, content: "Error add Question Answers to blockchain !"}
            }
        }
    }
)

export const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        toggleAddQcm: (state, action) => {
            state.idCourse = action.payload;
            state.openAddQcm = !state.openAddQcm;
        }
    },
    extraReducers: {
        // Fetch List Courses -------------------------------------------------------------
        [fetchListCourses.pending]: state => {
            state.listCourses = [];
            state.loadingListCourses = false;
        },
        [fetchListCourses.fulfilled]: (state, action) => {
            if(!action.payload.errorFlag) state.listCourses = action.payload.content;
            state.loadingListCourses = false;
        },
        [fetchListCourses.rejected]: (state, action) => {
            state.loadingListCourses = false;
        },
        // Upload New Course -------------------------------------------------------------
        [uploadCourseToBlockchain.pending] : state => {
            state.errorUploadCourse = "";
            state.loadingUploadCourse = true;
        },
        [uploadCourseToBlockchain.fulfilled] : (state, action) => {
            if(action.payload.errorFlag) state.errorUploadCourse = action.payload.content;
            state.loadingUploadCourse = false;
        },
        [uploadCourseToBlockchain.rejected] : state => {
            state.errorUploadCourse = "Upload Course was rejected"
            state.loadingUploadCourse = false;
        },
        // Upload Question Answers -------------------------------------------------------------
        [uploadQuestionAnswersOfCourse.pending] : state => {
            state.errorUploadQuestionAnswer = "";
            state.loadingUploadQCM = true;
        },
        [uploadQuestionAnswersOfCourse.fulfilled] : (state, action) => {
            if(action.payload.errorFlag) state.errorUploadQuestionAnswer = action.payload.content;
            state.loadingUploadQCM = false;
        },
        [uploadQuestionAnswersOfCourse.rejected] : (state, action) => {
            console.log("uploadQuestionAnswersOfCourse : Rejected !");
            state.loadingUploadQCM = false;
        },
    },
});

export const {toggleAddQcm} = adminSlice.actions;

export const selectErrorUploadCourse = state => state.admin.errorUploadCourse;
export const selectLoadingUploadCourse = state => state.admin.loadingUploadCourse;

export const selectErrorUploadQuestionAnswer = state => state.admin.errorUploadQuestionAnswer;
export const selectLoadingUploadQCM = state => state.admin.loadingUploadQCM;

export const selectListCourses = state => state.admin.listCourses;
export const selectLoadingListCourses = state => state.admin.loadingListCourses;

export const selectOpenAddQcm = state => state.admin.openAddQcm;
export const selectIdCourse = state => state.admin.idCourse;

export default adminSlice.reducer;
