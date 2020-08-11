const path = require('path')
const dbClient = require('./dbclient')
const express = require('express')
const jwt = require('jsonwebtoken')
const jwtConfig = require('./jwtConfig')
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

router.post('/login', (req, res) => {
  const postData = req.body;
  const username = postData.username
  const password = postData.password
  
  if (username !== masterUsername || password !== masterPassword) {
    res.status(401).send('Wrong username or password')
  } else {
    const token = jwt.sign({username}, jwtConfig.secret, { expiresIn: jwtConfig.sessionTokenLife})
    const response = {
        "status": "Logged in",
        "token": token,
    }
    res.status(200).json(response)
  }
})

router.use(require('./tokenChecker'))

router.get('/status', (req, res) => {
  res.status(200)
  res.json({'status':'ok'})
  res.end()
})

router.get('/tasks', async (req, res) => {
  const query = buildGetTasksQuery(req.query)
  const tasks = await dbClient.getElems({table: 'tasks', query})
  res.status(200)
  res.json(tasks)
  res.end()
})

router.post('/task', async (req, res) => {
  const task = req.body
  task.createdAt = new Date().toJSON()
  task.updatedAt = new Date().toJSON()
  task.doneAt = null
  const taskId = await dbClient.writeElem({table: 'tasks', task})
  res.status(200)
  res.json({'taskId': taskId})
  res.end()
})

router.put('/task/:taskId', async (req, res) => {
  const taskId = req.params.taskId
  const task = req.body
  task.updatedAt = new Date().toJSON()
  await dbClient.updateElem({table: 'tasks', task, taskId})
  res.status(200)
  res.json({'taskId': taskId})
  res.end()
})

router.delete('/task/:taskId', async (req, res) => {
  const taskId = req.params.taskId
  await dbClient.deleteElem({table: 'tasks', taskId})
  res.status(200)
  res.json({'taskId': taskId})
  res.end()
})

router.get('/goals', async (req, res) => {
  const query = {}
  const goals = await dbClient.getElems({table: 'goals', query})
  res.status(200)
  res.json(goals)
  res.end()
})

router.post('/goal', async (req, res) => {
  const task = req.body
  task.createdAt = new Date().toJSON()
  task.updatedAt = new Date().toJSON()
  task.colorCode = getRandomColor()
  task.doneAt = null
  const goalId = await dbClient.writeElem({table: 'goals', task})
  res.status(200)
  res.json({'goalId': goalId})
  res.end()
})

router.put('/goal/:taskId', async (req, res) => {
  const taskId = req.params.taskId
  const task = req.body
  task.updatedAt = new Date().toJSON()
  await dbClient.updateElem({table: 'goals', task, taskId})
  res.status(200)
  res.json({'goalId': taskId})
  res.end()
})

router.delete('/goal/:taskId', async (req, res) => {
  const taskId = req.params.taskId
  await dbClient.deleteElem({table: 'goals', taskId})
  res.status(200)
  res.json({'goalId': taskId})
  res.end()
})

router.get('/projects', async (req, res) => {
  const query = buildGetProjectsQuery(req.query)
  const projects = await dbClient.getElems({table: 'projects', query})
  res.status(200)
  res.json(projects)
  res.end()
})

router.get('/project/:projectId/tasks', async (req, res) => {
  const projectId = req.params.projectId
  const query = {'projectId': projectId}
  const tasks = await dbClient.getElems({table: 'tasks', query})
  res.status(200)
  res.json(tasks)
  res.end()
})

router.post('/project', async (req, res) => {
  const task = req.body
  task.createdAt = new Date().toJSON()
  task.updatedAt = new Date().toJSON()
  task.colorCode = getRandomColor()
  task.doneAt = null
  const projectId = await dbClient.writeElem({table: 'projects', task})
  res.status(200)
  res.json({'projectId': projectId})
  res.end()
})

router.put('/project/:taskId', async (req, res) => {
  const taskId = req.params.taskId
  const task = req.body
  task.updatedAt = new Date().toJSON()
  await dbClient.updateElem({table: 'projects', task, taskId})
  res.status(200)
  res.json({'projectId': taskId})
  res.end()
})

router.delete('/project/:taskId', async (req, res) => {
  const taskId = req.params.taskId
  await dbClient.deleteElem({table: 'projects', taskId})
  res.status(200)
  res.json({'projectId': taskId})
  res.end()
})


exports.router = router
