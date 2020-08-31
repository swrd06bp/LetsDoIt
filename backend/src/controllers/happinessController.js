const dbClient = require('../dbclient')


exports.happinessGet = async (req, res) => {
  const userId = req.decoded
  const gnh = await dbClient.getElems({
    table: 'happiness',
    query: {},
    userId,
    maxNum: 1,
  })
  res.status(200)
  res.json(gnh)
  res.end()
}


exports.happinessPost = async (req, res) => {
  const gnh = req.body
  gnh.createdAt = new Date().toJSON()
  gnh.updatedAt = new Date().toJSON()
  const gnhId = await dbClient.writeElem({table: 'happiness', elem: gnh, userId: req.decoded})
  res.status(200)
  res.json({'happinessId': gnhId})
  res.end()
}
