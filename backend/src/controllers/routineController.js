const dbClient = require('../dbclient')

exports.routineHabitGet = async (req, res) => {
  const habitId = req.params.habitId
  const { isDone, since, limit } = req.query
  let query =  { habitId }

  if (since)
    query['createdAt'] = {'$gte': new Date(since).toJSON()}
  if (isDone)
    query['isDone'] = (isDone === 'true')
  
  const routines = await dbClient.getElems({
    table: 'routines',
    query,
    userId: req.decoded,
    maxNum: parseInt(limit),
  })
  res.status(200)
  res.json(routines)
  res.end()
}


exports.routinePost = async (req, res) => {
  const routine = req.body
  routine.createdAt = new Date().toJSON()
  routine.updatedAt = new Date().toJSON()
  const routineId = await dbClient.writeElem({
    table: 'routines',
    elem: routine,
    userId: req.decoded,
  })
  res.status(200)
  res.json({'routineId': routineId})
  res.end()
  const token = req.body.token || req.query.token || req.headers['x-access-token']
  req.app.get("socketService").emiter('routines', 'update', token, req.decoded)
}

