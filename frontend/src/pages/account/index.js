import React, { useEffect, useState } from 'react'

import TopNavigation from '../../app/Navigation'
import Api from '../../app/Api'

function AccountPage (props) {
  const [showAuthError, setShowAuthError] = useState(false)
  const [showSimilarError, setShowSimilarError] = useState(false)
  const [showDifferentError, setShowDifferentError] = useState(false)
  const [showEmptyError, setShowEmptyError] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword1, setNewPassword1] = useState('')
  const [newPassword2, setNewPassword2] = useState('')
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const api = new Api()


  useEffect(() => {
    getName() 
  }, [])

  const getName = async () => {
    const resp = await api.getName()
    const json = await resp.json()
    if (json.length) {
      setName(json[0].name)
      setUsername(json[0].username)
    }
  }


  const changeName = async () => {
    await api.setName(name) 
  } 
  
  const changePassword = async () => {
    if (newPassword1 !== newPassword2) setShowDifferentError(true)
    else if (newPassword1 === '') setShowEmptyError(true)
    else if (newPassword1 === oldPassword) setShowSimilarError(true)
    else {
      const isChanged = await api.changePassword({
        username,
        oldPassword,
        newPassword: newPassword1
      })
      if (!isChanged) setShowAuthError(true)
      else {
        setOldPassword('')
        setNewPassword1('')
        setNewPassword2('')
      }
    }
  }

  return (
    <div>
      <TopNavigation />
      <br />
      <div style={styles().title}>Change your name</div>
      <br />
      <div className="form">
        <div className="login-form">
          <input type="text" placeholder="name" value={name} 
            onChange={(e) => {
              setName(e.target.value)
            }}
          />
          <button onClick={() => changeName()}>Save</button>
        </div>
      </div>
      <div style={styles().title}>Change your password</div>
      <br />
      <div className="form">
        <div className="login-form">
          <input type="password" placeholder="current password" value={oldPassword} 
            onChange={(e) => {
              setOldPassword(e.target.value)
              if (showAuthError) setShowAuthError(false)
            }}
          />
          <input type="password" placeholder="new password" value={newPassword1} 
            onChange={(e) => {
              setNewPassword1(e.target.value)
              if (showSimilarError) setShowSimilarError(false)
              if (showEmptyError) setShowEmptyError(false)
            }}
          />
          <input type="password" placeholder="confirm new password" value={newPassword2} 
            onChange={(e) => {
              setNewPassword2(e.target.value)
              if (newPassword1 === e.target.value && showDifferentError) setShowDifferentError(false)
            }}
          />
          {showAuthError && ( <div className='error'>The current password must be wrong.</div>)}
          {showEmptyError && ( <div className='error'>The new password cannot be empty.</div>)}
          {showDifferentError && ( <div className='error'>The passwords are the not the same.</div>)}
          {showSimilarError && ( <div className='error'>The new password and the old password cannot be the same.</div>)}
          <button onClick={() => changePassword()}>Save</button>
        </div>
      </div>
    </div>
  )
}


const styles = () => ({
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
 
})

export default AccountPage
