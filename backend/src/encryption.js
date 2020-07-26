const crypto = require('crypto')

const PASSWORD = 'les cannards sont tranquils dans le lac froid'

function encrypt(text) {
  const key = crypto.scryptSync(PASSWORD, 'salt', 24)
  const iv = crypto.randomBytes(16)
  let cipher = crypto.createCipheriv('aes-192-cbc', key, iv)
  let encrypted = cipher.update(text)
  encrypted = Buffer.concat([encrypted, cipher.final()])
  return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') }
}

function decrypt(text) {
  const key = crypto.scryptSync(PASSWORD, 'salt', 24)
  let iv = Buffer.from(text.iv, 'hex')
  let encryptedText = Buffer.from(text.encryptedData, 'hex')
  let decipher = crypto.createDecipheriv('aes-192-cbc', key, iv)
  let decrypted = decipher.update(encryptedText)
  decrypted = Buffer.concat([decrypted, decipher.final()])
  return decrypted.toString()
}

exports.encrypt = encrypt
exports.decrypt = decrypt
