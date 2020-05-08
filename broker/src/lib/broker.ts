import { Server } from 'aedes'
import { IPublishPacket } from 'mqtt-packet'

import logger from './logger'
import authenticate from './auth'
import { deviceConnectionStatus } from './api'
import { processMessage } from './processor'

const broker = Server({
  authenticate,
})

export const publish = (packet: IPublishPacket) => {
  broker.publish(packet, () => {
    logger.trace({ packet }, `Published on '${packet.topic}' topic`)
  })
}

broker.on('client', client => {
  logger.info({ clientId: client.id }, `Client connected`)

  if (!client.req) {
    deviceConnectionStatus(client.id, true)
  }
})

broker.on('clientDisconnect', client => {
  logger.info({ clientId: client.id }, `Client disconnected`)

  if (!client.req) {
    deviceConnectionStatus(client.id, false)
  }
})

broker.on('publish', (packet, client) => {
  if (client) {
    logger.info(
      { clientId: client.id, packet: { payload: packet.payload.toString() } },
      `Client '${client.id}' published packet on topic '${packet.topic}'`
    )

    // Process message
    processMessage(packet)
  }
})

broker.on('subscribe', (subscriptions, client) => {
  const subs = subscriptions
  logger.info(
    `Client ${client.id} subscribed to topic '${subs[0].topic}' with QoS ${subs[0].qos}`
  )
})

broker.on('clientError', (client, error) => {
  logger.trace({ client: client.id, error: error.message }, `Client error`)
})

broker.on('connectionError', (client, error) => {
  logger.trace({ client: client.id, error: error.message }, `Connection error`)
})

export default broker
