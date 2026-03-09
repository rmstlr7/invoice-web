import { getInvoiceById, INVOICE_ERROR_CODES } from '@/lib/invoices'
import { INVOICE_STATUS, type Invoice } from '@/types/invoice'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Metadata } from 'next'

// 상태별 스타일 맵
const STATUS_STYLES = new Map([
  [
    INVOICE_STATUS.PAID,
    {
      badge: 'bg-green-100 text-green-800',
      label: '납부완료',
    },
  ],
  [
    INVOICE_STATUS.UNPAID,
    {
      badge: 'bg-yellow-100 text-yellow-800',
      label: '미납',
    },
  ],
  [
    INVOICE_STATUS.OVERDUE,
    {
      badge: 'bg-red-100 text-red-800',
      label: '연체',
    },
  ],
  [
    INVOICE_STATUS.CANCELLED,
    {
      badge: 'bg-gray-100 text-gray-800',
      label: '취소',
    },
  ],
])

/**
 * 날짜를 한국 형식으로 포맷
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

/**
 * 금액을 한국 원화 형식으로 포맷
 */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * 메타데이터 생성
 */
export async function generateMetadata(props: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  try {
    const { id } = await props.params
    const invoice = await getInvoiceById(id)
    return {
      title: `인보이스 ${invoice.invoiceNumber}`,
      description: `${invoice.clientName} - ${formatCurrency(invoice.amount)}`,
    }
  } catch {
    return {
      title: '인보이스',
    }
  }
}

/**
 * 인보이스 상세 페이지
 */
export default async function InvoiceDetailPage(props: {
  params: Promise<{ id: string }>
}) {
  const { id } = await props.params

  let invoice: Invoice | null = null
  let error: string | null = null

  try {
    invoice = await getInvoiceById(id)
  } catch (err: unknown) {
    const error_obj = err as any
    if (error_obj.code === INVOICE_ERROR_CODES.NOT_FOUND) {
      error = '인보이스를 찾을 수 없습니다.'
    } else if (error_obj.code === INVOICE_ERROR_CODES.UNAUTHORIZED) {
      error = 'Notion API 인증 실패. 관리자에게 문의하세요.'
    } else {
      error = '인보이스를 불러올 수 없습니다.'
    }
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">오류 발생</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 sm:text-base">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!invoice) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>인보이스를 찾을 수 없습니다</CardTitle>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const statusStyle = STATUS_STYLES.get(invoice.status) || {
    badge: 'bg-gray-100 text-gray-800',
    label: '상태 없음',
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              인보이스 {invoice.invoiceNumber}
            </h1>
            <p className="mt-2 text-sm text-gray-600 sm:text-base">
              발급: {formatDate(invoice.issueDate)}
            </p>
          </div>
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold sm:px-4 sm:py-2 sm:text-sm ${statusStyle.badge}`}
          >
            {statusStyle.label}
          </span>
        </div>

        {/* 메인 카드 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>인보이스 상세</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 청구처 정보 */}
            <div className="border-b pb-6">
              <h3 className="mb-4 font-semibold text-gray-900">청구처</h3>
              <p className="text-lg text-gray-700">{invoice.clientName}</p>
            </div>

            {/* 금액 정보 */}
            <div className="border-b pb-6">
              <h3 className="mb-2 font-semibold text-gray-900">청구 금액</h3>
              <p className="text-2xl font-bold text-gray-900 sm:text-3xl">
                {formatCurrency(invoice.amount)}
              </p>
            </div>

            {/* 날짜 정보 */}
            <div className="grid grid-cols-1 gap-6 border-b pb-6 sm:grid-cols-2">
              <div>
                <p className="text-sm font-semibold text-gray-500">발급일</p>
                <p className="mt-1 text-sm text-gray-900 sm:text-base">
                  {formatDate(invoice.issueDate)}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">만기일</p>
                <p className="mt-1 text-sm text-gray-900 sm:text-base">
                  {formatDate(invoice.dueDate)}
                </p>
              </div>
            </div>

            {/* 설명 */}
            {invoice.description && (
              <div className="border-b pb-6">
                <h3 className="mb-2 font-semibold text-gray-900">설명</h3>
                <p className="text-gray-700">{invoice.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 액션 버튼 */}
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 sm:w-auto">
            PDF 다운로드
          </Button>
          <Button variant="outline" className="w-full sm:w-auto">
            이전으로
          </Button>
        </div>
      </div>
    </div>
  )
}
