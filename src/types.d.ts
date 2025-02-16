export type Element = {
  id: string
  type: string
  x: number
  y: number
  z: number
  rot: number
  height: number
  width: number
  content: string
  witdh: number
  origin?: string
}
export type Page = {
  pid: string
  icon: string
  title: string
  elements: Record<string, Element>
  last_saved: string
}
export type PageElements = Record<string, Element>
export type EmptyObject = Record<string, never>

export type EmojiGroups = {
  [key: string]: { [key: string]: string }
}
