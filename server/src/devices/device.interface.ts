export interface DeviceData {
  id: string
  groupId: string | null
  serial: string
  secret?: string
  connected: boolean
  properties: Record<string, any>
}

export interface DeviceRO {
  device: DeviceData
}

export interface Meta {
  count: number
  page: number
  pageSize: number
  sortOrder: string
}

export interface DeviceListRO {
  devices: DeviceData[]
  meta: Meta
}
