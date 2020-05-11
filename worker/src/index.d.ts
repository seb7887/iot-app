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

interface Timeseries {
  deviceId: string
  category: string
  numericValue: number | null
  stringValue: string | null
}

type TS = Timeseries & { id: string; time: any }

interface TSResponse {
  timeseries: TS
}

interface DeviceState {
  category: string
  value: string | number
}

interface Message {
  deviceId: string
  topic: string
  message: DeviceState
}
