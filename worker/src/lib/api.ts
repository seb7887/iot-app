import fetch from 'isomorphic-fetch'

import logger from './logger'

export const addTimeseries = async (ts: Timeseries): Promise<TSResponse> => {
  const url = `${process.env.API_URL}/timeseries`

  logger.trace({ url, timeseries: ts }, `Publishing Timeseries...`)

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(ts),
  })

  const body = await res.json()

  if (!res.ok) {
    logger.error(
      { timeseries: ts, statusCode: res.status, body },
      `Error publishing timeseries`
    )
  } else {
    logger.trace(body, `Timeseries published successfully`)
  }

  return body
}

export const updateDevice = async (
  deviceId: string,
  state: Record<string, any>
): Promise<DeviceResponse> => {
  const url = `${process.env.API_URL}/devices/${deviceId}`

  logger.trace({ url, deviceId, state }, `Updating device...`)

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${process.env.API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ properties: state }),
  })

  const body = await res.json()

  if (!res.ok) {
    logger.error(
      { deviceId, statusCode: res.status, body },
      `Error updating device`
    )
  } else {
    logger.trace(body, `Device successfully updated`)
  }

  return body
}
