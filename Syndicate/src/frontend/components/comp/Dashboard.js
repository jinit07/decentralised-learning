import React from 'react'
import Dropdown from 'react-bootstrap/Dropdown';

export const Dashboard = (props) => {
  const isOwner = props.owner == props.account;



  return (
    <>  
    

    <section className="py-5 text-center container">
      <div className="row py-lg-5">
        <div className="col-lg-6 col-md-8 mx-auto">
          <h1 className="">Syndicate Token App</h1>
          <br/>
          <p className="lead ">
          Welcome to
            <b>{" ".concat(props.admin_address)}</b>
            !!!
          {isOwner && <p>
            Balance: <b>{props.admin_balance}</b>
            
          </p>}

            {!isOwner && 
          <p>Welcome <b>{props.name}</b>
          <br/>
          
          
          Balance: <b>{props.balance}</b>
            <br/>
            Batch: <b>{props.batch}</b>
          </p>}
          </p>
    
        </div>
      </div>
    </section>
    </>
  )
}

