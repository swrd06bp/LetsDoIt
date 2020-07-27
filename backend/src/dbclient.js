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
  const {from, until, unfinished, someday} = params
  let timeQuery = {
    'dueDate': {
      '$gte': new Date(from).toJSON(),
    },
  }
  if (until)
    timeQuery.dueDate['$lt'] = new Date(until).toJSON()

  let query = [timeQuery]

  if (someday === 'true')
    query.push({'dueDate': null})
  if (unfinished === 'true')
    query.push({'isDone' : false})

  const db = client.db('toDoList')
  let collection = db.collection('tasks')
  return await collection.find(
    {'$or': query},
    {"sort": [['createdAt', 'desc']]}
  ).toArray()
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
