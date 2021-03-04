const fs = require("fs") 
const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const { SocketService } = require('./SocketService')
const cors = require('cors')
const { router } = require('./routes')
const { host, port, dns } = require('./config')
const { 
  sendTasksNotifications,
  sendRoutinesNotifications
} = require('./scheduledNotifications')
const cron = require('node-cron')

const app = express()
const server =  http.createServer(app) 


app.use('/public', express.static('build'))
app.use(cors())
app.use(bodyParser.json())
app.use('/v1', router)
app.set('port', process.env.port || 4001)
app.set('socketService', new SocketService(server))

cron.schedule('*/15 * * * *', function() {
  console.log('running a task every hour')
  sendTasksNotifications()
  sendRoutinesNotifications()
})

server.listen(port, host, () => {
  console.log(`Express running: ${dns}:${server.address().port}`)
})


