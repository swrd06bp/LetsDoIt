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

// -----------------------------------------
// tasks
// -----------------------------------------
async function getElems(client, {table, query}) {
  const db = client.db('toDoList')
  let collection = db.collection(table)
  return await collection.find(
    query,
    {"sort": [['createdAt', 'desc']]}
  ).toArray()
}

async function writeElem(client, {table, task}) {
  const db = client.db('toDoList')
  let collection = db.collection(table)
  return await collection.insertOne(task)
}

async function updateElem(client, {table, task, taskId}) {
  const db = client.db('toDoList')
  let collection = db.collection(table)
  return await collection.updateOne(
    {"_id": new ObjectId(taskId)},
    {$set: task}
  )
}

async function deleteElem(client, {table, taskId}) {
  const db = client.db('toDoList')
  let collection = db.collection(table)
  return await collection.deleteOne({'_id': new ObjectId(taskId)})
}


exports.getElems = wrapped(getElems)
exports.deleteElem = wrapped(deleteElem)
exports.updateElem = wrapped(updateElem)
exports.writeElem = wrapped(writeElem)

