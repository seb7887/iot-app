import pino from 'pino'

const logger = pino({
  name: 'iot-broker',
  level: process.env.LOG_LEVEL || 'info',
})

export default logger
