import { Client } from '@notionhq/client'
import { config } from '@/constants/config'

// Notion 클라이언트 싱글톤
let notionClient: Client | null = null

export function getNotionClient(): Client {
  if (!notionClient) {
    notionClient = new Client({
      auth: config.notionToken,
    })
  }
  return notionClient
}
