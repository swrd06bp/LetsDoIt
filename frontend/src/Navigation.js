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
      <Navbar.Brand href="/">LetsDoIt</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav" className="justify-content-between">
        <Form inline>
          <FormControl type="text" placeholder="Search" className="sm-2" />
          <Button variant="outline-success">Search</Button>
        </Form>
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
