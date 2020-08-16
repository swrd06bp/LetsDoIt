import React from 'react'
import { Button, Navbar, Nav, NavDropdown, Form, FormControl } from 'react-bootstrap'

import Api from './Api'

function TopNavigation() {

  const clickLogoug = () => {
    const api = new Api()
    api.logout()
    window.location.assign('/login')
  } 
  
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav" className="justify-content-between">
      <Navbar.Brand href="/">LetsDoIt</Navbar.Brand>
        <Nav className="sm-2" align="right">
          <NavDropdown title="Settings" id="basic-nav-dropdown">
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={clickLogoug}>Logout</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}


export default TopNavigation
