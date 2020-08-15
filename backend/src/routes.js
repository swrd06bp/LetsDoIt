const path = require('path')
const dbClient = require('./dbclient')
const express = require('express')
const jwt = require('jsonwebtoken')
const jwtConfig = require('./jwtConfig')
const encryption = require('./encryption')
const fetch = require('node-fetch')
const router = express.Router()
const { 
  buildGetTasksQuery,
  buildGetProjectsQuery,
  getRandomColor,
} = require('./utils')

const [masterUsername, masterPassword] = [
  'XevXjFeBt68QsJWEWqsfx9eaZrYXT68czXNetSjx',
  'bfyXtzvsajrTQukpdKSSHxKFxA9CJxLyh6rwJyQH'
]

const captchaSecret = '6LfWLL8ZAAAAAKMgAMlPf3iv2V1FD9mTr4QzRw2m'

router.post('/login', async (req, res) => {
  const {username, password } = req.body

  const user = await dbClient.getElems({table: 'users', query: {username}})
  
  if (!user.length) {
    res.status(401).send('Username does not exist')
    return
  }
  
  const {userId, encryptedPass} = user[0]


  if (encryption.decrypt(encryptedPass) !== password) {
    res.status(401).send('Wrong username of password')
  } else {
    const token = jwt.sign({userId}, jwtConfig.secret, { expiresIn: jwtConfig.sessionTokenLife})
    const response = {
        "status": "Logged in",
        "token": token,
    }
    res.status(200).json(response)
  }
})

router.post('/signup', async (req, res) => {
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
    const userId = await dbClient.writeElem({table: 'users', task: {name, username, encryptedPass}})
    res.status(200)
    res.json({'userId': userId})
    res.end()
  } else {
    res.status(400)
    res.end()
  }


  
})

router.use(require('./tokenChecker'))

router.get('/status', (req, res) => {
  res.status(200)
  res.json({'status':'ok'})
  res.end()
})


router.post('/task', async (req, res) => {
  const task = req.body
  task.createdAt = new Date().toJSON()
  task.updatedAt = new Date().toJSON()
  task.doneAt = null
  const taskId = await dbClient.writeElem({table: 'tasks', elem: task, userId: req.decoded})
  res.status(200)
  res.json({'taskId': taskId})
  res.end()
})


router.get('/tasks', async (req, res) => {
  const query = buildGetTasksQuery(req.query)
  const tasks = await dbClient.getElems({table: 'tasks', query, userId: req.decoded})
  res.status(200)
  res.json(tasks)
  res.end()
})

router.post('/task', async (req, res) => {
  const task = req.body
  task.createdAt = new Date().toJSON()
  task.updatedAt = new Date().toJSON()
  task.doneAt = null
  const taskId = await dbClient.writeElem({table: 'tasks', elem: task, userId: req.decoded})
  res.status(200)
  res.json({'taskId': taskId})
  res.end()
})

router.put('/task/:taskId', async (req, res) => {
  const taskId = req.params.taskId
  const task = req.body
  task.updatedAt = new Date().toJSON()
  await dbClient.updateElem({table: 'tasks', elem: task, elemId: taskId, userId: req.decoded})
  res.status(200)
  res.json({'taskId': taskId})
  res.end()
})

router.delete('/task/:taskId', async (req, res) => {
  const taskId = req.params.taskId
  await dbClient.deleteElem({table: 'tasks', elemId: taskId, userId: req.decoded})
  res.status(200)
  res.json({'taskId': taskId})
  res.end()
})

router.get('/goals', async (req, res) => {
  const query = {}
  const goals = await dbClient.getElems({table: 'goals', query, userId: req.decoded})
  res.status(200)
  res.json(goals)
  res.end()
})

router.post('/goal', async (req, res) => {
  const goal = req.body
  goal.createdAt = new Date().toJSON()
  goal.updatedAt = new Date().toJSON()
  goal.colorCode = getRandomColor()
  goal.doneAt = null
  const goalId = await dbClient.writeElem({table: 'goals', elem: goal, userId: req.decoded})
  res.status(200)
  res.json({'goalId': goalId})
  res.end()
})

router.put('/goal/:goalId', async (req, res) => {
  const goalId = req.params.goalId
  const goal = req.body
  goal.updatedAt = new Date().toJSON()
  await dbClient.updateElem({table: 'goals', elem: goal, elemId: goalId, userId: req.decoded})
  res.status(200)
  res.json({'goalId': goalId})
  res.end()
})

router.delete('/goal/:goalId', async (req, res) => {
  const goalId = req.params.goalId
  await dbClient.deleteElem({table: 'goals', elemId: goalId, userId: req.decoded})
  res.status(200)
  res.json({'goalId': goalId})
  res.end()
})

router.get('/projects', async (req, res) => {
  const query = buildGetProjectsQuery(req.query)
  const projects = await dbClient.getElems({table: 'projects', query, userId: req.decoded})
  res.status(200)
  res.json(projects)
  res.end()
})

router.get('/project/:projectId/tasks', async (req, res) => {
  const projectId = req.params.projectId
  const query = {'projectId': projectId}
  const tasks = await dbClient.getElems({table: 'tasks', query, userId: req.decoded})
  res.status(200)
  res.json(tasks)
  res.end()
})

router.post('/project', async (req, res) => {
  const project = req.body
  project.createdAt = new Date().toJSON()
  project.updatedAt = new Date().toJSON()
  project.colorCode = getRandomColor()
  project.doneAt = null
  const projectId = await dbClient.writeElem({table: 'projects', elem: project, userId: req.decoded})
  res.status(200)
  res.json({'projectId': projectId})
  res.end()
})

router.put('/project/:projectId', async (req, res) => {
  const projectId = req.params.projectId
  const project = req.body
  project.updatedAt = new Date().toJSON()
  await dbClient.updateElem({table: 'projects', elem: project, elemId: projectId, userId: req.decoded})
  res.status(200)
  res.json({'projectId': projectId})
  res.end()
})

router.delete('/project/:projectId', async (req, res) => {
  const projectId = req.params.projectId
  await dbClient.deleteElem({table: 'projects', elemId: projectId, userId: req.decoded})
  res.status(200)
  res.json({'projectId': projectId})
  res.end()
})


exports.router = router
