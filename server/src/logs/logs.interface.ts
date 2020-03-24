export interface LogData {
  id: string
  deviceId: string
  connected: boolean
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
