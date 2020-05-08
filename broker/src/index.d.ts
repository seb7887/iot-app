type Connection = 'device' | 'ws'

interface Device {
  id: string
  groupId: string
  serial: string
  secret?: string
  connected: boolean
  properties: Record<string, any>
}

interface DeviceResponse {
  device: Device
}
