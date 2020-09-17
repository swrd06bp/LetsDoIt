import openSocket from 'socket.io-client'

const host = window.location.href.split(':4002')[0]
const baseUrl = host + ':4001'
const socket = openSocket(baseUrl)


function updateSocket(cb) {
  socket.emit('new', localStorage.getItem('user'))
  socket.on('update', data => cb(null, data))
}

export { updateSocket }
