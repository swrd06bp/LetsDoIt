import openSocket from 'socket.io-client'

const host = window.location.href.split(':3998')[0]
const baseUrl = host + ':3999'
const socket = openSocket(baseUrl)


function getNewEntry(cb) {
  socket.on('newData', data => cb(null, JSON.parse(data)))
}

function getUpdateEntry(cb) {
  socket.on('updateData', data => cb(null, JSON.parse(data)))
}

export { getNewEntry, getUpdateEntry }
