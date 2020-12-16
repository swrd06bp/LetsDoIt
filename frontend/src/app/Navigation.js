import React, { useState, useEffect } from 'react'
import { Navbar, Nav, NavDropdown, } from 'react-bootstrap'

import { todayDate } from './utils'
import { updateSocketElems, removeSocketListener } from '../app/socket'
import Api from './Api'

function TopNavigation() {
  const [showLink, setShowLink] = useState(false)

  useEffect(() => {
    updateSocketElems('happiness', (err, data) => getHappiness())
    getHappiness() 
    return () => removeSocketListener('happiness')
  }, [])

  const getHappiness = async () => {
    const api = new Api()
    const resp = await api.getHappiness(1)
    const json = await resp.json()
    if (!json.length || new Date(json[0].dueDate) < todayDate()) 
      setShowLink(true) 
  }

  const clickLogout = () => {
    const api = new Api()
    api.logout()
    window.location.assign('/login')
  } 

  const goAccountPage = () => {
    window.location.assign('/account')
  }

  
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav" className="justify-content-between">
      <Navbar.Brand href="/"><img src='/logo.png' style={styles.logoImage} alt='' /></Navbar.Brand>
      {showLink && ( <Navbar.Brand href={'/happinesscreate/' + new Date().toJSON()} style={styles.linkHappiness}>Check yourself</Navbar.Brand>)} 
        <Nav className="sm-2" align="right">
          <Nav.Item>
            <Nav.Link href='/'>Home</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href='/happiness'>Happiness</Nav.Link>
          </Nav.Item>
          <NavDropdown title="Settings" id="basic-nav-dropdown">
            <NavDropdown.Item onClick={goAccountPage}>Account</NavDropdown.Item>
            <NavDropdown.Divider />
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
  logoImage: {
    height: 50,
    width: 100.
  },
}

export default TopNavigation
