// 인보이스 상태 상수
export const INVOICE_STATUS = {
  UNPAID: 'UNPAID',
  PAID: 'PAID',
  OVERDUE: 'OVERDUE',
  CANCELLED: 'CANCELLED',
} as const

export type InvoiceStatus = (typeof INVOICE_STATUS)[keyof typeof INVOICE_STATUS]

// 인보이스 항목 인터페이스
export interface InvoiceItem {
  description: string
  quantity: number
  unitPrice: number
  amount: number
}

// 인보이스 메인 인터페이스
export interface Invoice {
  id: string
  invoiceNumber: string
  clientName: string
  amount: number
  issueDate: string
  dueDate: string
  status: InvoiceStatus
  description?: string
  items?: InvoiceItem[]
}

// API 응답 타입
export interface InvoiceApiResponse {
  success: true
  data: Invoice
}

export interface InvoiceApiErrorResponse {
  success: false
  error: {
    code: string
    message: string
  }
}

export type InvoiceApiResult = InvoiceApiResponse | InvoiceApiErrorResponse
