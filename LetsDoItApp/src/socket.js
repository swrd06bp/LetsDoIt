import AsyncStorage from '@react-native-community/async-storage'
import socketIO from 'react-native-socketio'


const host = 'https://mstaging.calipsa.io'
const baseUrl = host + ':4001'
const socket = new socketIO(baseUrl)

socket.connect()

async function updateSocket(cb) {
    try {
      const token = await AsyncStorage.getItem('@token')
      socket.emit('new', token)
      socket.on('update', data => cb(null, data))
    } catch (e) {
      console.log(e)
    }
}

export { updateSocket }
