import React from 'react'
import { useState } from 'react'

export const Add = (props) => {

  

    const [name, setName] = useState("")
    const [batch, setBatch] = useState()
    const [address, setAddress] = useState("")


    const submit=(e)=>{
        e.preventDefault();
        console.log("Submiting")
        if(!name || !batch || !address) alert("Field can't be empty")
        else{
            
                props.AddStudentHandler(name, batch, address);
        }
        setName("");
        setBatch(0);
        setAddress("");
    }


    return (
        <>
            <div>
            <link href="form-validation.css" rel="stylesheet" />
            <div className="container">
                <main>
                    <div className="py-5 text-center">
                        <h2>ADD STUDENT</h2>
                        <p className="lead">
                            Enter the details of the student
                        </p>
                    </div>
                    <div className="row g-5">
                    {/* <div className="col-md-5 col-lg-4 order-md-last">
                            <h4 className="d-flex justify-content-between align-items-center mb-3">
                                <span className="text-primary">Student</span>
                                <span className="badge bg-primary rounded-pill">{}</span>
                            </h4>

                            <ul className="list-group mb-3">
                                {
                                   props.student_token.map(item => (
                                    <li className="list-group-item d-flex justify-content-between lh-sm">
                                    <div>
                                        <h6 className="my-0">{props.student_name[item-1]}</h6>
                                        <h5 className="text-muted">{props.student_Batch[item - 1]}</h5>
                                    </div>
                                    <span className="text-muted">{props.student_token[item-1]}</span>
                                    <span className="text-muted"> {props.student_Balance[item - 1]}/-</span>
                                </li>
                                   ))
                                }
                            </ul>
                        </div> */}
                        


                        <div className="col-md-7 col-lg-8">
                            <h4 className="mb-3">STUDENT DETAILS</h4>
                            <form onSubmit={submit} className="needs-validation" noValidate="">
                                <div className="row g-3">
                                    <div className="sm-6">
                                        <label htmlFor="firstName" className="form-label">
                                            NAME
                                        </label>
                                        <input
                                            type="text"
                                            value={name} onChange={(e)=> {setName(e.target.value)}}
                                            className="form-control"
                                            id="firstName"
                                            placeholder=""
                                            defaultValue=""
                                            required=""
                                        />
                                        <div className="invalid-feedback">
                                            Enter a Valid Name
                                        </div>
                                    </div>
                                    <div className="md-6">
                                        <label htmlFor="price" className="form-label">
                                            BATCH
                                        </label>
                                        <input
                                            type="text"
                                            value={batch}  onChange={(e)=> {setBatch(e.target.value)}}
                                            className="form-control"
                                            id="cc-number"
                                            placeholder=""
                                            required=""
                                        />
                                        <div className="invalid-feedback">
                                            Enter Valid Batch
                                        </div>
                                    </div>
                                    <div className="md-6">
                                        <label htmlFor="quantity" className="form-label">
                                            ADDRESS
                                        </label>
                                        <input
                                            type="text"
                                            value={address}  onChange={(e)=> {setAddress(e.target.value)}}
                                            className="form-control"
                                            id="cc-number"
                                            placeholder=""
                                            required=""
                                        />
                                        <div className="invalid-feedback">
                                            Enter Valid Address
                                        </div>
                                    </div>
                                <hr className="my-4" />

                                <button type="submit" className=" container btn btn-success text-center">
                                    ADD STUDENT
                                </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </main>

               
            </div>
            </div>

        </>
    )
}
