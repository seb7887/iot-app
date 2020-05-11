import redis from 'redis'
import { IPublishPacket } from 'mqtt-packet'

import { updateDevice } from './api'
import { publish } from './broker'
import { parseTopic, generatePacket } from './utils'

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: 6379,
  retry_strategy: () => 1000,
})

export const processMessage = (packet: IPublishPacket) => {
  const [deviceId, topic] = parseTopic(packet.topic)

  const payload = {
    deviceId,
    topic,
    message: JSON.parse(packet.payload.toString()),
  }

  if (topic !== 'configure') {
    redisClient.publish('telemetry', JSON.stringify(payload))
  } else {
    processMQTTLog(deviceId, packet)
  }
}

const processMQTTLog = (deviceId: string, packet: IPublishPacket) => {
  const { state } = JSON.parse(packet.payload.toString())

  updateDevice(deviceId, {
    properties: state,
  })
    .then(() => {
      const logPacket = generatePacket(
        `${deviceId}/_log`,
        JSON.stringify(state),
        true,
        1
      )
      publish(logPacket)
    })
    .catch(err => {
      const errorPayload = {
        error: {
          code: err.statusCode,
          message: err.message,
        },
        state,
      }

      const rejectedPacket = generatePacket(
        `${deviceId}/_error`,
        JSON.stringify(errorPayload),
        true,
        1
      )
      publish(rejectedPacket)
    })
}
