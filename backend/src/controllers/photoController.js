const fetch = require('node-fetch')

const accessKey = 'Yeke6XrKhDxlN8WTQJGKYLgaTEkcgPu3cle-lGBuV18'
const secretKey = 'gs7ExltLSL7CxgwHLmAPABE5sQYn3HcUlXNVYgI9fDI'
const baseUrl =h 'ttps://api.unsplash.com/photos/random/'

exports.photoGet = async (req, res) => {
  const resp = await fetch(`${baseUrl}?client_id=${accessKey}&count=1&query=beach`)
  const json = resp.json()
  res.status(200)
  res.json(json)
  res.end()
}

