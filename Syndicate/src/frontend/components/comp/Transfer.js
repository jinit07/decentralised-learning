import React from 'react'
import { useState } from 'react'

export const Transfer = (props) => {

  

    const [to_tokenId, setToTokenId] = useState(0)
    const [to_amount, setAmount] = useState(0)


    const submit=(e)=>{
        e.preventDefault();
        console.log("Submiting")
        if(!to_tokenId || !to_amount) alert("Field can't be empty")
        else{
            
                props.TransferHandler(to_tokenId, to_amount);
        }
        setToTokenId(0);
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
                            Enter the details of the student you want to transfer amount to!
                        </p>
                    </div>
                    <div className="row g-5">
                        


                        <div className="col-md-7 col-lg-8">
                            <h4 className="mb-3">STUDENT DETAILS</h4>
                            <form onSubmit={submit} className="needs-validation" noValidate="">
                                <div className="row g-3">
                                    <div className="sm-6">
                                        <label htmlFor="firstName" className="form-label">
                                            TOKEN ID
                                        </label>
                                        <input
                                            type="text"
                                            value={to_tokenId} onChange={(e)=> {setToTokenId(e.target.value)}}
                                            className="form-control"
                                            id="firstName"
                                            placeholder=""
                                            defaultValue=""
                                            required=""
                                        />
                                        <div className="invalid-feedback">
                                            Valid Token ID is required.
                                        </div>
                                    </div>
                                    <div className="md-6">
                                        <label htmlFor="price" className="form-label">
                                            AMOUNT
                                        </label>
                                        <input
                                            type="text"
                                            value={to_amount}  onChange={(e)=> {setAmount(e.target.value)}}
                                            className="form-control"
                                            id="cc-number"
                                            placeholder=""
                                            required=""
                                        />
                                        <div className="invalid-feedback">
                                            Amount can't be empty
                                        </div>
                                    </div>
                                   
                                <hr className="my-4" />

                                <button type="submit" className=" container btn btn-success text-center">
                                    TRANSFER
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
