// 환경 변수 접근 모듈
export const config = {
  notionToken: process.env.NOTION_API_KEY || '',
  notionDatabaseId: process.env.NOTION_DATABASE_ID || '',
  nodeEnv: process.env.NODE_ENV || 'development',
} as const

// 환경 변수 검증
export function validateConfig() {
  if (!config.notionToken) {
    console.warn('NOTION_API_KEY가 설정되지 않았습니다.')
  }
  if (!config.notionDatabaseId) {
    console.warn('NOTION_DATABASE_ID가 설정되지 않았습니다.')
  }
}
