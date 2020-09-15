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
async function getElems(client, {table, query, userId, maxNum}) {
  const maxLim = maxNum ? maxNum : 999999
  const masterQuery = userId ? {'$and': [query, userId]} : query
  const db = client.db('toDoList')
  let collection = db.collection(table)
  return await collection.find(
    query,
    {"sort": [['createdAt', 'desc']]}
  ).limit(maxLim).toArray()
}

async function writeElem(client, {table, elem, userId}) {
  const db = client.db('toDoList')
  let collection = db.collection(table)
  return await collection.insertOne({...elem, userId})
}

async function updateElem(client, {table, elem, elemId, userId}) {
  const db = client.db('toDoList')
  let collection = db.collection(table)
  return await collection.updateOne(
    {"_id": new ObjectId(elemId), userId},
    {$set: elem}
  )
}

async function deleteElem(client, {table, elemId, userId}) {
  const db = client.db('toDoList')
  let collection = db.collection(table)
  return await collection.deleteOne({'_id': new ObjectId(elemId), userId})
}

async function deleteManyElems(client, {table, query, userId}) {
  const db = client.db('toDoList')
  let collection = db.collection(table)
  return await collection.deleteMany({...query, userId})
}


exports.getElems = wrapped(getElems)
exports.deleteElem = wrapped(deleteElem)
exports.deleteManyElems = wrapped(deleteManyElems)
exports.updateElem = wrapped(updateElem)
exports.writeElem = wrapped(writeElem)

