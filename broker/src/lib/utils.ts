import { IPublishPacket, QoS } from 'mqtt-packet'

export const parseTopic = (topic: string): string[] => {
  const slashIndex = topic.indexOf('/')
  return [topic.substring(0, slashIndex), topic.substring(slashIndex + 1)]
}

export const generatePacket = (
  topic: string,
  payload: string | Buffer,
  retain = false,
  qos: QoS = 0
): IPublishPacket => ({
  topic,
  payload,
  cmd: 'publish',
  qos,
  dup: false,
  retain,
})
