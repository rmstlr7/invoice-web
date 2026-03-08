import { NextRequest, NextResponse } from 'next/server'
import { getInvoiceById } from '@/lib/invoices'
import type { InvoiceApiResult } from '@/types/invoice'

/**
 * GET /api/invoices/[id]
 * 인보이스 상세 정보를 JSON으로 반환
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<InvoiceApiResult>> {
  try {
    const { id } = await params

    if (!id || id.trim() === '') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_ID',
            message: 'ID 파라미터가 필요합니다.',
          },
        },
        { status: 400 }
      )
    }

    const invoice = await getInvoiceById(id)

    return NextResponse.json(
      {
        success: true,
        data: invoice,
      },
      { status: 200 }
    )
  } catch (error: any) {
    // 에러 분기 처리
    if (error.code === 'INVOICE_NOT_FOUND') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: error.code,
            message: error.message,
          },
        },
        { status: 404 }
      )
    }

    if (error.code === 'UNAUTHORIZED') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: error.code,
            message: error.message,
          },
        },
        { status: 401 }
      )
    }

    if (error.code === 'RATE_LIMITED') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: error.code,
            message: error.message,
          },
        },
        { status: 429 }
      )
    }

    // 기본 에러 응답
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: '서버 오류가 발생했습니다.',
        },
      },
      { status: 500 }
    )
  }
}
