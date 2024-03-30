// AddCourse.js
import React, { useRef, useState } from "react";
import "./AddCourse.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { uploadCourseToBlockchain, selectLoadingUploadCourse, selectErrorUploadCourse } from "../adminSlice"; // Import the selectors
import Alert from "@mui/material/Alert";

export const AddCourse = () => {
  const dispatch = useDispatch();

  const loadingUploadCourse = useSelector(selectLoadingUploadCourse);
  const errorUploadCourse = useSelector(selectErrorUploadCourse);

  const [title, setTitle] = useState("");
  const [resume, setResume] = useState("");
  const [ipfsLink, setIpfsLink] = useState(""); // New state to hold IPFS link

  const uploadNewCourse = (e) => {
    e.preventDefault();
    dispatch(
      uploadCourseToBlockchain({
        _title: title,
        _resume: resume,
        _ipfsLink: ipfsLink, // Pass IPFS link to the action
      })
    );
    setTitle("");
    setResume("");
    setIpfsLink(""); // Clear IPFS link after upload
  };

  return (
    <form className={"addCourse"}>
      <p className={"addCourse__title"}>New Course</p>
      <TextField
        className={"addCourse__input"}
        label="Title"
        variant="outlined"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField
        className={"addCourse__input"}
        label="Resume"
        variant="outlined"
        value={resume}
        onChange={(e) => setResume(e.target.value)}
        multiline
        rows={4}
      />
      <TextField
        className={"addCourse__input"}
        label="IPFS Link"
        variant="outlined"
        value={ipfsLink}
        onChange={(e) => setIpfsLink(e.target.value)}
      />
      <Button
        className={"addCourse__upload"}
        variant="contained"
        onClick={uploadNewCourse}
        disabled={!title || !resume || !ipfsLink} // Disable button if any field is empty
      >
        Upload
      </Button>
      {errorUploadCourse && <Alert severity="error">{errorUploadCourse}</Alert>}
    </form>
  );
};
