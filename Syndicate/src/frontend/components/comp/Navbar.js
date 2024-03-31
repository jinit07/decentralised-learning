import React from 'react'
import Dropdown from 'react-bootstrap/Dropdown';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { Container } from 'react-bootstrap';
import { NavDropdown } from 'react-bootstrap';



export const NavBar = (props) => {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        {props.address == undefined &&
          <Navbar.Brand><Button variant="primary" onClick={props.ConnectWalletHandler}>Connect</Button></Navbar.Brand>}
          <Navbar.Brand><Nav.Link href="/">HOME</Nav.Link></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* <Nav.Link href="/about">About</Nav.Link> */}
            {props.owner == props.account && <Nav.Link href="/Add">ADD</Nav.Link>}
            {props.owner == props.account && <Nav.Link href="/Award">AWARD</Nav.Link>}
            {props.owner != props.account && <Nav.Link href="/Transfer">TRANSFER</Nav.Link>}
            {props.owner != props.account && <Nav.Link href="/Redeem">REWARDS</Nav.Link>}
            <Nav.Link href="" className='text align-right'>{props.account}</Nav.Link>

            {/* <Nav.Link href="/help">Help</Nav.Link> */}


            {/* <NavDropdown title="Your Details" id="basic-nav-dropdown"> */}
              {/* <NavDropdown.Item>{customer[0]}</NavDropdown.Item> */}
              
            {/* </NavDropdown> */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}