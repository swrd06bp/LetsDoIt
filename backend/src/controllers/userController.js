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
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded"
  }
  const body = `secret=${captchaSecret}&response=${captchaToken}`
  const resp = await fetch(
    'https://www.google.com/recaptcha/api/siteverify',
    {method: 'post', headers, body }
  ) 
  const json = await resp.json()
  if (json.success && name && username && password) {
    const encryptedPass = encryption.encrypt(password)
    const userId = await dbClient.writeElem({table: 'users', elem: {name, username, encryptedPass}})
    res.status(200)
    res.json({'userId': userId})
    res.end()
  } else {
    res.status(400)
    res.end()
  }
}


exports.userGet = async (req, res) => {
  const userId = req.decoded
  const user = await dbClient.getElems({table: 'users', query: {'_id': new ObjectId(userId)}})
  res.status(200)
  res.json(user)
  res.end()
}
