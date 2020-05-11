const pino = require('pino')

const logger = pino({
  name: 'virtual-device',
  level: 'trace',
})

module.exports = logger
