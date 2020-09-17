const jwt = require('jsonwebtoken')
const jwtConfig = require('./jwtConfig')
const socketIo = require('socket.io')


let users = []

class SocketService {
   constructor(server) {
    this.io = socketIo(server)
    this.io.on('connection', socket => {
      socket.on('new', (token) => {
        jwt.verify(token, jwtConfig.secret, function(err, decoded) {
            users.push({userId: decoded.userId, socketId: socket.id, token})
        })
      })
      socket.on('disconnect', () => {
        const index = users.map(x => x.socketId).indexOf(socket.id)
        if (index >= 0)
          users.splice(index, 1)
      })
    })
   }


  emiter(event, body, token, userId) {
    const subUsers = users.filter(x => x.userId === userId && x.token !== token)
    const socketIds = subUsers.map(x => x.socketId)
    if(body)
      for (let socketId of socketIds)
        this.io.to(socketId).emit(event, body)
  }
}

exports.SocketService = SocketService
