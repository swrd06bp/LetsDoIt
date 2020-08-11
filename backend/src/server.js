const fs = require("fs") 
const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const cors = require('cors')
const { router } = require('./routes')
const { host, port, dns } = require('./config')
const app = express()


app.use(cors())
app.use(bodyParser.json())
app.use('/api', router)
app.set('port', process.env.port || 4001)

const server =  http.createServer(app) 
const io = require('socket.io')(server)

server.listen(port, host, () => {
  console.log(`Express running: ${dns}:${server.address().port}`)
})


