// API 경로 상수 관리
export const API_PATHS = {
  INVOICES: '/api/invoices',
  INVOICE_DETAIL: (id: string) => `/api/invoices/${id}`,
} as const
