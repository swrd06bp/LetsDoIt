const dbClient = require('../dbclient')
const { 
  buildGetProjectsQuery,
  getRandomColor,
} = require('../utils')

exports.projectGet = async (req, res) => {
  const query = buildGetProjectsQuery(req.query)
  const projects = await dbClient.getElems({table: 'projects', query, userId: req.decoded})
  res.status(200)
  res.json(projects)
  res.end()
}


exports.projectPost = async (req, res) => {
  const project = req.body
  project.createdAt = new Date().toJSON()
  project.updatedAt = new Date().toJSON()
  project.colorCode = getRandomColor()
  project.doneAt = null
  const projectId = await dbClient.writeElem({table: 'projects', elem: project, userId: req.decoded})
  res.status(200)
  res.json({'projectId': projectId})
  res.end()
}

exports.projectPut = async (req, res) => {
  const projectId = req.params.projectId
  const project = req.body
  project.updatedAt = new Date().toJSON()
  await dbClient.updateElem({
    table: 'projects',
    elem: project,
    elemId: projectId,
    userId: req.decoded
  })
  res.status(200)
  res.json({'projectId': projectId})
  res.end()
}


exports.projectDelete = async (req, res) => {
  const projectId = req.params.projectId
  await dbClient.deleteManyElems({table: 'tasks', query: {projectId}, userId: req.decoded})
  await dbClient.deleteElem({table: 'projects', elemId: projectId, userId: req.decoded})
  res.status(200)
  res.json({'projectId': projectId})
  res.end()
}
