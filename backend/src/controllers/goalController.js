const dbClient = require('../dbclient')
const { ObjectId } = require('mongodb')
const { 
  getRandomColor,
} = require('../utils')


exports.goalGet = async (req, res) => {
  const query = req.params.goalId ? { _id: new ObjectId(req.params.goalId) } : {}
  const goals = await dbClient.getElems({
    table: 'goals',
    query,
    userId: req.decoded,
  })
  res.status(200)
  res.json(goals)
  res.end()
}


exports.goalPost = async (req, res) => {
  const goal = req.body
  goal.createdAt = new Date().toJSON()
  goal.updatedAt = new Date().toJSON()
  goal.colorCode = getRandomColor()
  goal.doneAt = null
  const goalId = await dbClient.writeElem({table: 'goals', elem: goal, userId: req.decoded})
  res.status(200)
  res.json({'goalId': goalId})
  res.end()
}


exports.goalPut = async (req, res) => {
  const goalId = req.params.goalId
  const goal = req.body
  goal.updatedAt = new Date().toJSON()
  await dbClient.updateElem({table: 'goals', elem: goal, elemId: goalId, userId: req.decoded})
  res.status(200)
  res.json({'goalId': goalId})
  res.end()
}

exports.goalDelete = async (req, res) => {
  const goalId = req.params.goalId
  // clean the tasks
  await dbClient.deleteManyElems({table: 'tasks', query: {goalId}, userId: req.decoded})
  // clean the routines
  const allHabits = await dbClient.getElems({
    table: 'habits',
    query: { goalId },
    userId: req.dodecoded}
  )
  for (let habit of allHabits) {
    const resp = await dbClient.deleteManyElems({
      table: 'routines',
      query: {habitId: habit._id.toString()},
      userId: req.decoded
    })
  }
  // clean the habits
  await dbClient.deleteManyElems({table: 'habits', query: {goalId}, userId: req.decoded})
  // clean the goal
  await dbClient.deleteElem({table: 'goals', elemId: goalId, userId: req.decoded})
  res.status(200)
  res.json({'goalId': goalId})
  res.end()
}
