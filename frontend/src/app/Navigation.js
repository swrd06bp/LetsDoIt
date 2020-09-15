import React, { useState, useEffect } from 'react'
import { Navbar, Nav, NavDropdown, } from 'react-bootstrap'

import { todayDate } from './utils'
import Api from './Api'

function TopNavigation() {
  const [showLink, setShowLink] = useState(false)

  useEffect(() => {
    getHappiness() 
  }, [])

  const getHappiness = async () => {
    const api = new Api()
    const resp = await api.getHappiness(1)
    const json = await resp.json()
    if (!json.length || new Date(json[0].createdAt) < todayDate()) 
      setShowLink(true) 
  }

  const clickLogout = () => {
    const api = new Api()
    api.logout()
    window.location.assign('/login')
  } 
  
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav" className="justify-content-between">
      <Navbar.Brand href="/">LetsDoIt</Navbar.Brand>
      {showLink && ( <Navbar.Brand href='/happiness' style={styles.linkHappiness}>Check yourself</Navbar.Brand>)} 
        <Nav className="sm-2" align="right">
          <NavDropdown title="Settings" id="basic-nav-dropdown">
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={clickLogout}>Logout</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

const styles = {
  linkHappiness: {
    cursor: 'pointer',
    color:'blue',
    textAlign: 'center',
    textDecoration: 'underline blue',
  },
}

export default TopNavigation
