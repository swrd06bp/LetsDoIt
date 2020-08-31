const dbClient = require('../dbclient')
const { 
  buildGetTasksQuery,
} = require('../utils')


exports.taskGet = async (req, res) => {
  const query = buildGetTasksQuery(req.query)
  const tasks = await dbClient.getElems({table: 'tasks', query, userId: req.decoded})
  res.status(200)
  res.json(tasks)
  res.end()
}


exports.taskPost = async (req, res) => {
  const task = req.body
  task.createdAt = new Date().toJSON()
  task.updatedAt = new Date().toJSON()
  task.doneAt = null
  const taskId = await dbClient.writeElem({table: 'tasks', elem: task, userId: req.decoded})
  res.status(200)
  res.json({'taskId': taskId})
  res.end()
}

exports.taskPut = async (req, res) => {
  const taskId = req.params.taskId
  const task = req.body
  task.updatedAt = new Date().toJSON()
  await dbClient.updateElem({table: 'tasks', elem: task, elemId: taskId, userId: req.decoded})
  res.status(200)
  res.json({'taskId': taskId})
  res.end()
}


exports.taskDelete = async (req, res) => {
  const taskId = req.params.taskId
  await dbClient.deleteElem({table: 'tasks', elemId: taskId, userId: req.decoded})
  res.status(200)
  res.json({'taskId': taskId})
  res.end()
}


exports.taskGoalGet = async (req, res) => {
  const goalId = req.params.goalId
  const query = {'goalId': goalId}
  const tasks = await dbClient.getElems({table: 'tasks', query, userId: req.decoded})
  res.status(200)
  res.json(tasks)
  res.end()
}

exports.taskProjectGet =  async (req, res) => {
  const projectId = req.params.projectId
  const query = {'projectId': projectId}
  const tasks = await dbClient.getElems({table: 'tasks', query, userId: req.decoded})
  res.status(200)
  res.json(tasks)
  res.end()
}
