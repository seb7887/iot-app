export interface TimeseriesData {
  id: string
  deviceId: string
  category: string
  numericValue?: number
  stringValue?: string
  time: Date
}

export interface TimeseriesRO {
  timeseries: TimeseriesData
}

export interface Meta {
  count: number
  page: number
  pageSize: number
  sortOrder: string
}

export interface TimeseriesListRO {
  timeseries: TimeseriesData[]
  meta: Meta
}
