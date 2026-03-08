import { config } from '@/constants/config'
import { getNotionClient } from './notion'
import type { Invoice, InvoiceStatus } from '@/types/invoice'

// 에러 코드 상수
export const INVOICE_ERROR_CODES = {
  NOT_FOUND: 'INVOICE_NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  RATE_LIMITED: 'RATE_LIMITED',
  SERVER_ERROR: 'SERVER_ERROR',
  INVALID_DATABASE: 'INVALID_DATABASE',
} as const

// Notion 데이터베이스 속성명 매핑
export const NOTION_PROPERTY_NAMES = {
  invoiceNumber: '인보이스번호', // Title 속성
  clientName: '고객명',
  amount: '금액',
  issueDate: '발급일',
  dueDate: '만기일',
  status: '상태',
  description: '설명',
  items: '항목',
} as const

/**
 * Notion 페이지를 Invoice 객체로 변환하는 헬퍼 함수
 */
export function mapNotionPageToInvoice(
  pageId: string,
  properties: Record<string, any>
): Invoice {
  // 상태 값 매핑
  const statusValue =
    properties[NOTION_PROPERTY_NAMES.status]?.select?.name || ''
  const statusMap: Record<string, InvoiceStatus> = {
    미납: 'UNPAID',
    납부완료: 'PAID',
    연체: 'OVERDUE',
    취소: 'CANCELLED',
  }

  return {
    id: pageId,
    invoiceNumber: extractText(properties[NOTION_PROPERTY_NAMES.invoiceNumber]),
    clientName: extractText(properties[NOTION_PROPERTY_NAMES.clientName]),
    amount: extractNumber(properties[NOTION_PROPERTY_NAMES.amount]),
    issueDate: extractDate(properties[NOTION_PROPERTY_NAMES.issueDate]),
    dueDate: extractDate(properties[NOTION_PROPERTY_NAMES.dueDate]),
    status: statusMap[statusValue] || 'UNPAID',
    description: extractText(properties[NOTION_PROPERTY_NAMES.description]),
  }
}

/**
 * Notion 텍스트 속성에서 값 추출
 */
function extractText(property?: any): string {
  if (!property) return ''
  if (property.title) {
    return property.title.map((t: any) => t.plain_text).join('')
  }
  if (property.rich_text) {
    return property.rich_text.map((t: any) => t.plain_text).join('')
  }
  return ''
}

/**
 * Notion 숫자 속성에서 값 추출
 */
function extractNumber(property?: any): number {
  return property?.number ?? 0
}

/**
 * Notion 날짜 속성에서 값 추출
 */
function extractDate(property?: any): string {
  return property?.date?.start ?? ''
}

/**
 * Notion 페이지 ID로 인보이스 조회 (가장 빠름)
 */
export async function getInvoiceById(pageId: string): Promise<Invoice> {
  try {
    const client = getNotionClient()
    const page = await client.pages.retrieve({ page_id: pageId })

    if (!('properties' in page)) {
      throw new Error('Invalid page format')
    }

    return mapNotionPageToInvoice(pageId, page.properties)
  } catch (error: any) {
    if (error.status === 404) {
      throw {
        code: INVOICE_ERROR_CODES.NOT_FOUND,
        message: '인보이스를 찾을 수 없습니다.',
        status: 404,
      }
    }
    if (error.status === 401) {
      throw {
        code: INVOICE_ERROR_CODES.UNAUTHORIZED,
        message: 'Notion API 인증 실패',
        status: 401,
      }
    }
    if (error.status === 429) {
      throw {
        code: INVOICE_ERROR_CODES.RATE_LIMITED,
        message: 'API 요청 제한. 잠시 후 다시 시도하세요.',
        status: 429,
      }
    }
    throw {
      code: INVOICE_ERROR_CODES.SERVER_ERROR,
      message: '서버 오류가 발생했습니다.',
      status: 500,
    }
  }
}

/**
 * 인보이스 번호로 데이터베이스 검색
 */
export async function getInvoiceByNumber(
  invoiceNumber: string
): Promise<Invoice> {
  try {
    const client = getNotionClient()
    const response = await client.databases.query({
      database_id: config.notionDatabaseId,
      filter: {
        property: NOTION_PROPERTY_NAMES.invoiceNumber,
        title: {
          equals: invoiceNumber,
        },
      },
    })

    if (response.results.length === 0) {
      throw {
        code: INVOICE_ERROR_CODES.NOT_FOUND,
        message: '인보이스를 찾을 수 없습니다.',
        status: 404,
      }
    }

    const page = response.results[0]
    if (!('properties' in page)) {
      throw new Error('Invalid page format')
    }

    return mapNotionPageToInvoice(page.id, page.properties)
  } catch (error: any) {
    if (error.code === INVOICE_ERROR_CODES.NOT_FOUND) {
      throw error
    }
    throw {
      code: INVOICE_ERROR_CODES.SERVER_ERROR,
      message: '서버 오류가 발생했습니다.',
      status: 500,
    }
  }
}

/**
 * 모든 인보이스 조회 (페이지네이션 지원)
 */
export async function getAllInvoices(cursor?: string): Promise<{
  invoices: Invoice[]
  nextCursor?: string
}> {
  try {
    const client = getNotionClient()
    const response = await client.databases.query({
      database_id: config.notionDatabaseId,
      start_cursor: cursor,
      page_size: 10,
    })

    const invoices = response.results
      .filter((page) => 'properties' in page)
      .map((page: any) => mapNotionPageToInvoice(page.id, page.properties))

    return {
      invoices,
      nextCursor: response.next_cursor ?? undefined,
    }
  } catch (error: any) {
    throw {
      code: INVOICE_ERROR_CODES.SERVER_ERROR,
      message: '인보이스 목록을 불러올 수 없습니다.',
      status: 500,
    }
  }
}
