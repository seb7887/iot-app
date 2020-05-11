const mqtt = require('mqtt')

const logger = require('./lib/logger')

const client = mqtt.connect('mqtt://localhost:1883', {
  username: 'fca3e2d5-2a53-4233-b758-92b1d7aefe03',
  password: '123456',
  clientId: 'fca3e2d5-2a53-4233-b758-92b1d7aefe03',
  clean: false,
})

client.on('connect', () => {
  logger.info(`Connected`)
})

client.on('close', () => {
  logger.info('Not Connected')
})

client.on('error', (error) => {
  logger.error({ error: error.message }, `Error`)
  client.end()
})
