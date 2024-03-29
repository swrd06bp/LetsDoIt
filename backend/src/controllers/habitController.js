const dbClient = require('../dbclient')
const { 
  getRandomColor,
} = require('../utils')


exports.habitGet = async (req, res) => {
  const { unfinished } = req.query

  let query = {}
  if (unfinished === 'true')
    query['doneAt'] = null
  else
    query['doneAt'] = {$ne: null}

  const habits = await dbClient.getElems({table: 'habits', query, userId: req.decoded})
  res.status(200)
  res.json(habits)
  res.end()
}

exports.habitGoalGet = async (req, res) => {
  const goalId = req.params.goalId
  const { doneAt, all } = req.query
  let query
  if (!doneAt && !all)
    query = {'goalId': goalId, doneAt: null}
  else if (doneAt && !all) {
    query = {'goalId': goalId, doneAt: {'&gte': new Date(doneAt).toJSON()}}
  }
  else {
    query = {'goalId': goalId}
  }

  const habits = await dbClient.getElems({
    table: 'habits',
    query,
    userId: req.decoded,
  })
  res.status(200)
  res.json(habits)
  res.end()
}

exports.habitPut = async (req, res) => {
  const habitId = req.params.habitId
  const habit = req.body
  habit.updatedAt = new Date().toJSON()
  await dbClient.updateElem({table: 'habits', elem: habit, elemId: habitId, userId: req.decoded})
  res.status(200)
  res.json({'habitId': habitId})
  res.end()
}



exports.habitPost = async (req, res) => {
  const habit = req.body
  habit.createdAt = new Date().toJSON()
  habit.updatedAt = new Date().toJSON()
  habit.doneAt = null
  const habitId = await dbClient.writeElem({
    table: 'habits',
    elem: habit,
    userId: req.decoded,
  })
  res.status(200)
  res.json({'habitId': habitId})
  res.end()
}

exports.habitDelete = async (req, res) => {
  const habitId = req.params.habitId
  await dbClient.deleteManyElems({
    table: 'routines',
    query: {habitId},
    userId: req.decoded,
  })
  await dbClient.deleteElem({
    table: 'habits',
    elemId: habitId,
    userId: req.decoded,
  })
  res.status(200)
  res.json({'taskId': habitId})
  res.end()
}
