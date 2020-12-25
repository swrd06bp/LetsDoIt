const fs = require("fs") 
const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const { SocketService } = require('./SocketService')
const cors = require('cors')
const { router } = require('./routes')
const { host, port, dns } = require('./config')
const { sendAllNotifications } = require('./scheduledNotifications')
const cron = require('node-cron')

const app = express()
const server =  http.createServer(app) 


app.use(cors())
app.use(bodyParser.json())
app.use('/v1', router)
app.set('port', process.env.port || 4001)
app.set('socketService', new SocketService(server))

cron.schedule('0 * * * *', function() {
  console.log('running a task every hour')
  sendAllNotifications()
})

server.listen(port, host, () => {
  console.log(`Express running: ${dns}:${server.address().port}`)
})


