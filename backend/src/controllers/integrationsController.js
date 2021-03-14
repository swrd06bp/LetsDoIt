
const dbClient = require('../dbclient')


exports.slackGet = async (req, res) => {
  const userId = req.decoded
  const notif = await dbClient.getElems({
    table: 'integrations',
    query: { type: 'slack' },
    userId,
  })
  res.status(200)
  res.json(notif)
  res.end()
}

exports.integrationsPost = async (req, res) => {
  let elem = req.body

  const userId = req.decoded
  const integrations = await dbClient.getElems({
    table: 'integrations',
    query: { ...elem },
  })

  if (integrations.length === 0) {
    elem.createdAt = new Date().toJSON()
    elem.updatedAt = new Date().toJSON()
    const integrationId = await dbClient.writeElem({
      table: 'integrations',
      elem,
      userId: req.decoded
    })
    res.json({'integrationId': integrationId})
  }
  res.status(200)
  res.end()
}

