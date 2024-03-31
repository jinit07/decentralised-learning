import React from 'react'
import { useState } from 'react'

export const Award = (props) => {

  

    const [token, setToken] = useState("")
    const [amount, setAmount] = useState(0)


    const submit=(e)=>{
        e.preventDefault();
        console.log("Submiting")
        if(!token || !amount) alert("Field can't be empty")
        else{
            
                props.Transfer_Admin(token, amount);
        }
        setToken("");
        setAmount(0);
    }


    return (
        <>
            <div>
            <link href="form-validation.css" rel="stylesheet" />
            <div className="container">
                <main>
                    <div className="py-5 text-center">
                        <h2>TRANSFER</h2>
                        <p className="lead">
                            Enter the following details
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
                            <h4 className="mb-3">DETAILS</h4>
                            <form onSubmit={submit} className="needs-validation" noValidate="">
                                <div className="row g-3">
                                    <div className="sm-6">
                                        <label htmlFor="firstName" className="form-label">
                                            TOKEN ID
                                        </label>
                                        <input
                                            type="text"
                                            value={token} onChange={(e)=> {setToken(e.target.value)}}
                                            className="form-control"
                                            id="firstName"
                                            placeholder=""
                                            defaultValue=""
                                            required=""
                                        />
                                        <div className="invalid-feedback">
                                            Valid token is required.
                                        </div>
                                    </div>
                                    <div className="md-6">
                                        <label htmlFor="price" className="form-label">
                                            AMOUNT
                                        </label>
                                        <input
                                            type="text"
                                            value={amount}  onChange={(e)=> {setAmount(e.target.value)}}
                                            className="form-control"
                                            id="cc-number"
                                            placeholder=""
                                            required=""
                                        />
                                        <div className="invalid-feedback">
                                            Amount is required
                                        </div>
                                    </div>
                                    
                                <hr className="my-4" />

                                <button type="submit" className=" container btn btn-success text-center">
                                    AWARD
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
