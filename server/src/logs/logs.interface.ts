export interface LogData {
  id: string
  deviceId: string
  connected: boolean
  createdAt?: Date
}

export interface LogRO {
  log: LogData
}

export interface Meta {
  count: number
  page: number
  pageSize: number
  sortOrder: string
}

export interface LogsListRO {
  logs: LogData[]
  meta: Meta
}
