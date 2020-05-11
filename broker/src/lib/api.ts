import fetch from 'isomorphic-fetch'
import logger from './logger'

const deviceAuth = async (
  deviceId: string,
  secret: string
): Promise<boolean> => {
  const body = JSON.stringify({
    deviceId,
    secret,
  })

  const url = `${process.env.API_URL}/devices/auth`

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.API_KEY}`,
      'Content-Type': 'application/json',
    },
    body,
  })

  if (!res.ok) {
    logger.warn({ statusCode: res.status, url }, `API Response`)
    return false
  }

  const { authenticated } = await res.json()

  return authenticated
}

const jwtAuth = async (jwt: string): Promise<boolean> => {
  const url = `${process.env.API_URL}/users/validate-jwt`
  const body = JSON.stringify({ jwt })

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.API_KEY}`,
      'Content-Type': 'application/json',
    },
    body,
  })

  if (!res.ok) {
    logger.warn({ statusCode: res.status, url }, `API Response`)
    return false
  }

  const { isValid } = await res.json()

  return isValid
}

export const checkAuthentication = async (
  type: Connection,
  username: string,
  password: string
): Promise<boolean> => {
  return type === 'device' ? deviceAuth(username, password) : jwtAuth(password)
}

export const publishLog = async (deviceId: string, connected: boolean) => {
  const logData = {
    deviceId,
    connected,
  }

  try {
    const url = `${process.env.API_URL}/logs`

    logger.trace({ url, ...logData }, `Publishing device log`)

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(logData),
    })

    const body = await res.json()

    if (!res.ok) {
      logger.error(
        { deviceId, statusCode: res.status, body },
        `Error publishing device log`
      )
    } else {
      logger.trace(logData, `Device log published successfully`)
    }
  } catch (err) {
    logger.error({ ...logData, err }, `Error publishing device log`)
  }
}

interface DeviceState {
  groupId?: string
  connected?: boolean
  properties?: Record<string, any>
}

export const updateDevice = async (
  deviceId: string,
  state: DeviceState
): Promise<DeviceResponse> => {
  const url = `${process.env.API_URL}/devices/${deviceId}`

  logger.trace({ url, deviceId, state }, `Updating device...`)

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${process.env.API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(state),
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

export const deviceConnectionStatus = async (
  deviceId: string,
  connected: boolean
) => {
  return Promise.all([
    await publishLog(deviceId, connected),
    await updateDevice(deviceId, { connected }),
  ])
}
