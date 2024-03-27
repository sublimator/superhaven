// Define types for the event data
export type EventType = 'input' | 'output'
export type DataType = unknown

export interface EventData {
  id: number // auto incrementing id
  type: EventType
  data: DataType
}

export type LogSink = (data: string) => void
export type EventSink = (type: EventType, data: DataType) => void
