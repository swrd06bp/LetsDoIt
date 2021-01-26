import React, { useState, useEffect } from 'react'
import { Navbar, Nav, NavDropdown, } from 'react-bootstrap'
import { useMixpanel } from 'react-mixpanel-browser'
import moment from 'moment'

import { todayDate } from './utils'
import { updateSocketElems, removeSocketListener } from '../app/socket'
import Api from './Api'

function TopNavigation() {
  const [happiness, setHappiness] = useState(false)
  const mixpanel = useMixpanel()
  const api = new Api()

  useEffect(() => {
    getCurrentCustomization()  
  }, [])

  const getCurrentCustomization = async () => {
    const resp = await api.getCustomization() 
    const json = await resp.json()
    if (json[0].customization) {
      const customization = json[0].customization
      setHappiness(customization.happiness)
    }
  } 

  const clickLogout = () => {
    if (mixpanel.config.token)
      mixpanel.track('Top navigation - Logout')
    const api = new Api()
    api.logout()
    window.location.assign('/login')
  } 

  const goAccountPage = () => {
    if (mixpanel.config.token)
      mixpanel.track('Top navigation - Go to account page')
    window.location.assign('/account')
  }

  const goCustomizationPage = () => {
    if (mixpanel.config.token)
      mixpanel.track('Top navigation - Go to customization page')
    window.location.assign('/customization')
  }
  
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav" className="justify-content-between">
      <Navbar.Brand href="/" onClick={() => {
        if (mixpanel.config.token)
          mixpanel.track('Top navigation - Go to logo icon home')
      }}><img src='/logo.png' style={styles.logoImage} alt='' /></Navbar.Brand>
        <Nav className="sm-2" align="right">
          <Nav.Item>
            <Nav.Link href='/' onClick={() => {
              if (mixpanel.config.token)
                mixpanel.track('Top navigation - Go to home page')
            }}>Home</Nav.Link>
          </Nav.Item>
          {happiness && (<Nav.Item>
            <Nav.Link href='/happiness' onClick={() =>{
              if (mixpanel.config.token)
                mixpanel.track('Top navigation - Go to happiness page')
            }}>Happiness</Nav.Link>
          </Nav.Item>)}
          <NavDropdown title="Settings" id="basic-nav-dropdown" alignRight>
            <NavDropdown.Item onClick={goCustomizationPage}>Customization</NavDropdown.Item>
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
