const dbClient = require('../dbclient')
const { 
  getRandomColor,
} = require('../utils')


exports.goalGet = async (req, res) => {
  const query = {}
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
  await dbClient.deleteElem({table: 'goals', elemId: goalId, userId: req.decoded})
  res.status(200)
  res.json({'goalId': goalId})
  res.end()
}
