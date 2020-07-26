const { MongoClient, ObjectId } = require('mongodb')
const { mongoUrl } = require('./config')

function wrapped(operation)  { 
  return async function (args) {
    const client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true })
        .catch(err => { console.log(err) })
    
    if (!client)
        return
    let res = null
     
    try {
      res = await operation(client, args)
    } catch (err) {
        console.log(err)
    } finally {
        client.close()
    }
    return res
  }
}


async function getTasks(client, {params}) {
  const {from, until} = params
  let query = {
    'createdAt': {
      '$gte': new Date(from),
      '$lt': new Date(),
    },
  }
  console.log('qeury', query, params)
  const db = client.db('toDoList')
  let collection = db.collection('tasks')
  return await collection.find({}, {"sort": [['createdAt', 'desc']]}).toArray()
}

async function writeTask(client, {task}) {
  const db = client.db('toDoList')
  let collection = db.collection('tasks')
  return await collection.insertOne(task)
}

async function updateTask(client, {task, taskId}) {
  const db = client.db('toDoList')
  let collection = db.collection('tasks')
  return await collection.updateOne(
    {"_id": new ObjectId(taskId)},
    {$set: task}
  )
}

async function deleteTask(client, {taskId}) {
  const db = client.db('toDoList')
  let collection = db.collection('tasks')
  return await collection.deleteOne({'_id': new ObjectId(taskId)})
}


exports.getTasks = wrapped(getTasks)
exports.deleteTask = wrapped(deleteTask)
exports.updateTask = wrapped(updateTask)
exports.writeTask = wrapped(writeTask)
