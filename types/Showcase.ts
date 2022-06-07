import { Attachment } from 'airtable'

export type Showcase = {
  id: string
  name: string
  description: string
  links: string[]
  medias: Attachment[]
  tags: string[]
  likes: number
}
