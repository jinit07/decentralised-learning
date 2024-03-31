pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;


contract Courses {

    struct Course {
        uint idCourse;
        string title;
        string resume;
        string urlPdf;
        string urlImage;
        uint timestamp;
    }

    constructor () public {
        nbrCourses = 0;
    }

    struct Answer {
        string text;
        bool flag;
    }

    uint private nbrCourses;
    mapping (uint => Course) private courses;
    mapping (uint => string[]) private questions;
    mapping (uint => mapping (uint => Answer[])) answers;
    mapping (uint => address[]) private certifiedStudents;

    function newCourse (string memory _title, string memory _resume, string memory _urlPdf, string memory _urlImage) public returns (bool _success){
        courses[nbrCourses].idCourse = nbrCourses;
        courses[nbrCourses].title = _title;
        courses[nbrCourses].resume = _resume;
        courses[nbrCourses].urlPdf = _urlPdf;
        courses[nbrCourses].urlImage = _urlImage;
        courses[nbrCourses].timestamp = block.timestamp;
        nbrCourses++;
        return true;
    }

    function ifCoursesIsEmpty() public view returns (bool _success) {
        if(nbrCourses > 0) return false;
        return true;
    }

    function addQuestionWithAnswersToCourse(uint _idCourse, string memory _question, string[] memory _answers, bool[] memory _flags)
    public
    returns(bool _success){
        questions[_idCourse].push(_question);
        uint indexQuestion = questions[_idCourse].length - 1;
        for(uint i = 0; i < _answers.length; i++){
            Answer memory answer = Answer({text: _answers[i], flag: _flags[i]});
            answers[_idCourse][indexQuestion].push(answer);
        }
        return true;
    }

    function getCourses() public view returns (Course[] memory){
        Course[] memory arrCourses = new Course[](nbrCourses);
        for(uint8 i = 0; i < nbrCourses; i++){
            Course storage course = courses[i];
            arrCourses[i] = course;
        }
        return arrCourses;
    }

    function getCourseById(uint _idCourse) public view returns (Course memory){
        return courses[_idCourse];
    }

    function ifThereIsQuestion(uint _idCourse) public view returns(bool){
        if(questions[_idCourse].length > 0) return true;
        return false;
    }

    function getQuestionsOfCourse(uint _idCourse) public view returns(string[] memory){
        return questions[_idCourse];
    }

    function getAnswersOfQuestion(uint _idCourse, uint _indexQuestion) public view returns(Answer[] memory){
        return answers[_idCourse][_indexQuestion];
    }

    function getAddressesCertifiedStudentsByCourseID(uint _idCourse) public view returns(address[] memory){
        return certifiedStudents[_idCourse];
    }

    function ifAlreadyCertified(uint _idCourse, address _address) view public returns(bool){
        for(uint i = 0; i < certifiedStudents[_idCourse].length; i++){
            if(certifiedStudents[_idCourse][i] == _address) return true;
        }
        return false;
    }

    function addAddressCertifiedStudent(uint _idCourse, address _adrStudent) public returns(bool _success){
        if(!ifAlreadyCertified(_idCourse, _adrStudent)) certifiedStudents[_idCourse].push(_adrStudent);
        return true;
    }
}
