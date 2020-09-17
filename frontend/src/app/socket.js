import openSocket from 'socket.io-client'

const host = window.location.href.split(':4002')[0]
const baseUrl = host + ':4001'
const socket = openSocket(baseUrl)


function createSocketConnection() {
  socket.emit('new', localStorage.getItem('user'))
}

function updateSocketTasks(cb) {
  socket.on('tasks', data => cb(null, data))
}

function updateSocketRoutines(cb) {
  socket.on('routines', data => cb(null, data))
}

function updateSocketHappiness(cb) {
  socket.on('happiness', data => cb(null, data))
}

function removeSocketListener(eventName) {
  socket.off(eventName)
}

export { 
  createSocketConnection,
  updateSocketTasks,
  updateSocketRoutines,
  updateSocketHappiness,
  removeSocketListener,
}
