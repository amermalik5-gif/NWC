export interface ChartDataPoint {
  name: string
  value: number
  color?: string
}

export interface MonthlyDataPoint {
  month: string
  created: number
  completed: number
}

export interface SourceStat {
  source: string
  total: number
  inProgress: number
  completed: number
  rate: number
}

export interface TaskStats {
  total: number
  open: number
  inProgress: number
  completed: number
  cancelled: number
  onHold: number
  overdue: number
  bySource: ChartDataPoint[]
  byServiceType: ChartDataPoint[]
  byStatus: ChartDataPoint[]
  byMonth: MonthlyDataPoint[]
  sourceStats: SourceStat[]
}
