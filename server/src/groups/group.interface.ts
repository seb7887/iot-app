export interface GroupData {
  id: string
  name: string
  parentId: string | null
}

export interface GroupRO {
  group: GroupData
}

export interface Meta {
  count: number
  page: number
  pageSize: number
  sortOrder: string
}

export interface GroupListRO {
  groups: GroupData[]
  meta: Meta
}
