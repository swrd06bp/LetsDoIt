const dbClient = require('../dbclient')


exports.notificationsGet = async (req, res) => {
  const userId = req.decoded
  const notif = await dbClient.getElems({
    table: 'notifications',
    query: {},
    userId,
  })
  res.status(200)
  res.json(notif)
  res.end()
}

exports.notificationsPost = async (req, res) => {
  const notif = req.body
  notif.createdAt = new Date().toJSON()
  notif.updatedAt = new Date().toJSON()
  const notifId = await dbClient.writeElem({
    table: 'notifications',
    elem: notif,
    userId: req.decoded
  })
  res.status(200)
  res.json({'notificationsId': notifId})
  res.end()
}

