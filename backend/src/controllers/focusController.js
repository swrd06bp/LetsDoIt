const dbClient = require('../dbclient')


exports.focusGet = async (req, res) => {
  const {type, number, limit} = req.query
  const userId = req.decoded
  const focus = await dbClient.getElems({
    table: 'focus',
    query: {type, number: parseInt(number)},
    userId,
    maxNum: parseInt(limit),
  })
  res.status(200)
  res.json(focus)
  res.end()
}


exports.focusPost = async (req, res) => {
  const focus = req.body
  focus.createdAt = new Date().toJSON()
  focus.updatedAt = new Date().toJSON()
  const focusId = await dbClient.writeElem({table: 'focus', elem: focus, userId: req.decoded})
  res.status(200)
  res.json({'focusId': focusId})
  res.end()
  const token = req.body.token || req.query.token || req.headers['x-access-token']
  req.app.get("socketService").emiter('focus', 'update', token, req.decoded)
}


exports.focusPut = async (req, res) => {
  const focusId = req.params.focusId
  const focus = req.body
  focus.updatedAt = new Date().toJSON()
  const focustId = await dbClient.updateElem({table: 'focus', elem: focus, elemId: focusId, userId: req.decoded})
  res.status(200)
  res.json({'focusId': focusId})
  res.end()
  const token = req.body.token || req.query.token || req.headers['x-access-token']
  req.app.get("socketService").emiter('focus', 'update', token, req.decoded)
}

