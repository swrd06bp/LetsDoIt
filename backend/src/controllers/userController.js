const { ObjectId } = require('mongodb')
const dbClient = require('../dbclient')
const jwt = require('jsonwebtoken')
const jwtConfig = require('../jwtConfig')
const encryption = require('../encryption')
const fetch = require('node-fetch')


const captchaSecret = '6LfWLL8ZAAAAAKMgAMlPf3iv2V1FD9mTr4QzRw2m'


exports.userLogin = async (req, res) => {
  const {username, password } = req.body

  const user = await dbClient.getElems({table: 'users', query: {username}})
  
  if (!user.length) {
    res.status(401).send('Username does not exist')
    return
  }
  
  const {_id, encryptedPass} = user[0]


  if (encryption.decrypt(encryptedPass) !== password) {
    res.status(401).send('Wrong username of password')
  } else {
    const token = jwt.sign({userId: _id}, jwtConfig.secret, { expiresIn: jwtConfig.sessionTokenLife})
    const response = {
        "status": "Logged in",
        "token": token,
    }
    res.status(200).json(response)
  }
}


exports.userSignup = async (req, res) => {
  const { name, username, password, captchaToken } = req.body
  let success = true
  
  if (captchaToken !== 'Le soleil est grand et beau') {
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded"
    }
    const body = `secret=${captchaSecret}&response=${captchaToken}`
    const resp = await fetch(
      'https://www.google.com/recaptcha/api/siteverify',
      {method: 'post', headers, body }
    ) 
    const json = await resp.json()
    success = json.success
  }

  if (success && name && username && password) {
    const encryptedPass = encryption.encrypt(password)
    
    // check if user already exist
    const user = await dbClient.getElems({table: 'users', query: {username}})
    if (user.length) {
      res.status(400).send('Username already exist')
      return
    }
    
    // create a user
    const userId = await dbClient.writeElem({table: 'users', elem: {name, username, encryptedPass}})
    res.status(200)
    res.json({'userId': userId})
    res.end()
  } else {
    res.status(401).json('Issue with the captchaToken')
    res.end()
  }
}

exports.userChangePassword = async (req, res) => {
  const userId = req.decoded
  const {username, oldPassword, newPassword} = req.body
  const user = await dbClient.getElems({table: 'users', query: { username }})

  if (!user.length) {
    res.status(403)
    res.json({'success': false, 'message': 'User does not exist'})
    res.end()
    return
  }
  let {encryptedPass} = user[0]
  if (encryption.decrypt(encryptedPass) !== oldPassword) {
    res.status(403)
    res.json({'success': false, 'message': 'Wrong password'})
    res.end()
    return
  }

  encryptedPass = encryption.encrypt(newPassword)
  await dbClient.updateElem({
    table: 'users',
    elem: { encryptedPass },
    elemId: userId,
  })
  res.status(200)
  res.json({'userId': userId})
  res.end()
}


exports.userGet = async (req, res) => {
  const userId = req.decoded
  const user = await dbClient.getElems({table: 'users', query: {'_id': new ObjectId(userId)}})
  res.status(200)
  res.json(user)
  res.end()
}

exports.userPut = async (req, res) => {
  const userId = req.decoded
  const user = req.body
  await dbClient.updateElem({table: 'users', elem: user, elemId: userId})
  res.status(200)
  res.json({'userId': userId})
  res.end()
}
