import logger from './logger'
import { addTimeseries, updateDevice } from './api'

const processor = async (msg: Message) => {
  logger.trace(`Processing message of category '${msg.message.category}'`)
  if (msg.message.category === 'location') {
    const value = msg.message.value as string
    const [latitude, longitude] = value.split('|')
    const properties = {
      latitude,
      longitude,
    }

    await updateDevice(msg.deviceId, properties)
  } else {
    const value = Number(msg.message.value)

    await addTimeseries({
      deviceId: msg.deviceId,
      category: msg.message.category,
      numericValue: value,
      stringValue: null,
    })
  }
}

export default processor
