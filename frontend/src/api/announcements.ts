import { STRAPI_URL } from '../config'
import { fetchWithRetry } from './fetchWithRetry'

export interface AnnouncementMessage {
  id: number
  documentId: string
  message: string
  order: number
}

interface AnnouncementMessagesResponse {
  data: AnnouncementMessage[]
}

export async function getAnnouncementMessages(): Promise<
  AnnouncementMessage[]
> {
  const response = await fetchWithRetry(
    `${STRAPI_URL}/api/announcement-messages?sort=order:asc`,
  )

  if (!response.ok) {
    throw new Error(
      `Failed to fetch announcement messages: ${response.status}`,
    )
  }

  const result: AnnouncementMessagesResponse = await response.json()

  return result.data
}
