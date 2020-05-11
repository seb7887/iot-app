import pino from 'pino'

const logger = pino({
  name: 'iot-worker',
  level: process.env.LOG_LEVEL || 'info',
})

export default logger
