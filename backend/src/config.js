const dotenv = require('dotenv')
const result = dotenv.config()


const port = process.env.PORT ? parseInt(process.env.PORT) : 4001
const host = process.env.HOST ? process.env.HOST : '127.0.0.1'
const dns = host === '0.0.0.0' ? 'http://lets-do-it.me' : 'http://localhost'
const mongoHost = process.env.MONGO_HOST ? process.env.MONGO_HOST : 'localhost'
const mongoUrl = 'mongodb://' + mongoHost + ':27017'

const envs = {host, port, dns, mongoUrl}


module.exports = envs


