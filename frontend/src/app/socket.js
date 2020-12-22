import openSocket from 'socket.io-client'

const host = "https://lets-do-it.me"
const baseUrl = host + ':4001'
const socket = openSocket(baseUrl)


function createSocketConnection() {
  socket.emit('new', localStorage.getItem('user'))
}

function updateSocketElems(elem, cb) {
  socket.on(elem, data => cb(null, data))
}

function updateSocketHappiness(cb) {
  socket.on('happiness', data => cb(null, data))
}

function removeSocketListener(eventName) {
  socket.off(eventName)
}

export { 
  createSocketConnection,
  updateSocketElems,
  updateSocketHappiness,
  removeSocketListener,
}
