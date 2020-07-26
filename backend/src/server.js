const fs = require("fs") 
const express = require('express')
const router = express.Router()
const http = require('http')
const bodyParser = require('body-parser')
const path = require('path')
const dbClient = require('./dbclient')
const cors = require('cors')
const { host, port, dns } = require('./config')


const app = express()


router.get('/tasks', async (req, res) => {
  const params = req.query
  console.log(params)
  const tasks = await dbClient.getTasks({params})
  console.log('lol', tasks)
  res.status(200)
  res.json(tasks)
  res.end()
})

router.post('/task', async (req, res) => {
  const task = req.body
  task.createdAt = new Date().toJSON()
  task.updatedAt = new Date().toJSON()
  task.isDone = false
  const taskId = await dbClient.writeTask({task})
  res.status(200)
  res.json({'taskId': taskId})
  res.end()
})

router.put('/task/:taskId', async (req, res) => {
  const taskId = req.params.taskId
  const task = req.body
  task.updatedAt = new Date().toJSON()
  await dbClient.updateTask({task, taskId})
  res.status(200)
  res.json({'taskId': taskId})
  res.end()
})

router.delete('/task/:taskId', async (req, res) => {
  const taskId = req.params.taskId
  await dbClient.deleteTask({taskId})
  res.status(200)
  res.json({'taskId': taskId})
  res.end()
})


app.use(cors())
app.use(bodyParser.json())
app.use('/api', router)
app.set('port', process.env.port || 4001)

const server =  http.createServer(app) 
const io = require('socket.io')(server)

server.listen(port, host, () => {
  console.log(`Express running: ${dns}:${server.address().port}`)
})


