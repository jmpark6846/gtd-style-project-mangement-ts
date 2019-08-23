export interface Document {
  id: string
  title: string
  description?: string
  type: number
  user: string
  done: boolean
  projectId: string | null
  subdocs: string[]
}
