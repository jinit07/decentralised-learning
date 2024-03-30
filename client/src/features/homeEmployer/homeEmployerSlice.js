import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {AuthenticationContractAddress, CoursesContractAddress} from "../../config"
import Authentication from "../../contracts/Authentication.json"
import {ethers} from 'ethers'
import Courses from "../../contracts/Courses.json";

const initialState = {
    openSearch: false,
    dashboard: {},
    loadingCertifiedStudents: false,
    certifiedStudents: [],
}

async function initialProviderCourses () {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(CoursesContractAddress, Courses.abi, signer);
}
async function initialProviderAuthentication () {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(AuthenticationContractAddress, Authentication.abi, signer);
}


export const fetchCertifiedStudents = createAsyncThunk(
    'fetchCertifiedStudents',
    async ({_idCourse, _firstName, _familyName}) => {
        if(window.ethereum !== 'undefined'){
            const contractAuthentication = await initialProviderAuthentication();
            const contractCourses = await initialProviderCourses();
            try{
                const ifCoursesIsEmpty = await contractCourses.ifCoursesIsEmpty();
                if(ifCoursesIsEmpty) return {errorFlag: false, content: []};
                const addresses = await contractCourses.getAddressesCertifiedStudentsByCourseID(_idCourse);
                if(addresses.length === 0) return {errorFlag: false, content: []};
                console.log(addresses)
                let result = [];
                const _firstNameReg = new RegExp(String(_firstName).toLowerCase(),'i');
                const _familyNameReg = new RegExp(String(_familyName).toLowerCase(),'i');
                for(let i = 0; i < addresses.length; i++){
                    const student = await contractAuthentication.getStudentByAddress(addresses[i]);
                    console.log(student);
                    if(_firstNameReg.test(String(student[1])) && _familyNameReg.test(String(student[2]))){
                        result.push({
                            addressAccount: student[0],
                            firstName: student[1],
                            familyName: student[2]
                        });
                    }
                    // if(String(student[1]).toLowerCase() === String(_firstName).toLowerCase() &&
                    //     String(student[2]).toLowerCase() === String(_familyName).toLowerCase()){
                    //     result.push({
                    //         addressAccount: student[0],
                    //         firstName: student[1],
                    //         familyName: student[2]
                    //     });
                    // }
                }
                return {errorFlag: false, content: result};
            } catch (e) {
                console.log('Error fetch Certified Students from blockchain : ', e);
                return {errorFlag: true, content: "Error fetch Certified Students from blockchain !"}
            }
        }
    }
)

export const homeEmployerSlice = createSlice({
    name: 'homeEmployer',
    initialState,
    reducers: {
        toggleOpenSearch : (state, action) => {
            state.openSearch = !state.openSearch;
        },
        setDashboard: (state, action) => {
            state.dashboard = action.payload;
        }
    },
    extraReducers: {
        [fetchCertifiedStudents.pending]: state => {
            console.log("fetchCertifiedStudents : Pending");
            state.loadingCertifiedStudents = true;
        },
        [fetchCertifiedStudents.fulfilled]: (state, action) => {
            console.log("fetchCertifiedStudents : Fulfilled");
            if(!action.payload.errorFlag) state.certifiedStudents = action.payload.content;
            state.loadingCertifiedStudents = false;
        },
        [fetchCertifiedStudents.rejected]: (state, action) => {
            console.log("fetchCertifiedStudents : Rejected");
            state.loadingCertifiedStudents = false;
        },
    },
});

export const {toggleOpenSearch, setDashboard} = homeEmployerSlice.actions;

export const selectOpenSearch = state => state.homeEmployer.openSearch;
export const selectDashboard = state => state.homeEmployer.dashboard;
export const selectLoadingCertifiedStudents = state => state.homeEmployer.loadingCertifiedStudents;
export const selectCertifiedStudents = state => state.homeEmployer.certifiedStudents;

export default homeEmployerSlice.reducer;
