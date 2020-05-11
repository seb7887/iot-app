const mqtt = require('mqtt')
const faker = require('faker')

const logger = require('./lib/logger')

const argv = process.argv.slice(2)

if (!argv.includes('--id') || !argv.includes('--p')) {
  logger.error('Must provide Device ID and Password')
  process.exit(1)
}

const deviceId = argv[1]
const password = argv[3]
const publish = argv.includes('--publish')

const client = mqtt.connect('mqtt://localhost:1883', {
  username: deviceId,
  password,
  clientId: deviceId,
  clean: false,
})

client.on('connect', () => {
  logger.info(`Connected`)
  client.subscribe(`${deviceId}/configure`, () => {
    logger.trace(`Subscribed to ${deviceId}/configure`)
  })
})

client.on('message', (topic, payload) => {
  logger.info(
    { message: payload.toString() },
    `Message received on topic '${topic}'`
  )
})

client.on('close', () => {
  logger.info('Not Connected')
})

client.on('error', (error) => {
  logger.error({ error: error.message }, `Error`)
  client.end()
})
