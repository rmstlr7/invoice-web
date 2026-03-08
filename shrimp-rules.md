# Invoice Web - AI 개발 가이드

## 프로젝트 개요

**Invoice Web**은 Notion Database 기반의 인보이스 조회 및 PDF 다운로드 서비스입니다.

- **프로젝트명**: Invoice Web
- **기술 스택**: Next.js 15.5.3 + React 19 + TypeScript 5 + TailwindCSS v4 + Notion API
- **주요 목표**: 클라이언트가 고유 링크를 통해 인보이스를 안전하게 확인하고 PDF 다운로드

## 프로젝트 구조

```
src/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # 루트 레이아웃
│   ├── page.tsx             # 홈 페이지
│   ├── globals.css          # 글로벌 스타일 (TailwindCSS + CSS 변수)
│   ├── api/
│   │   └── invoices/
│   │       └── [id]/
│   │           └── route.ts # 인보이스 API 엔드포인트
│   └── invoices/
│       └── [id]/
│           └── page.tsx     # 인보이스 상세 페이지 (서버 컴포넌트)
├── components/
│   └── ui/                  # shadcn/ui 컴포넌트 (button, card, input, label)
├── constants/               # 상수 관리 (중앙 관리)
│   ├── api.ts              # API 경로
│   └── config.ts           # 환경 설정
├── lib/                     # 공유 유틸리티 & 비즈니스 로직
│   ├── notion.ts           # Notion 클라이언트 (싱글톤)
│   ├── invoices.ts         # 인보이스 조회 로직
│   └── utils.ts            # 유틸리티 함수
└── types/                   # TypeScript 타입 정의
    └── invoice.ts          # 인보이스 관련 타입
```

## 코드 표준

### 네이밍 컨벤션

| 대상       | 규칙                                       | 예시                                             |
| ---------- | ------------------------------------------ | ------------------------------------------------ |
| 파일명     | camelCase 또는 kebab-case (폴더 표준 따름) | `invoices.ts`, `[id]`                            |
| 폴더명     | kebab-case                                 | `constants/`, `components/ui/`                   |
| 함수명     | camelCase                                  | `getInvoiceById`, `mapNotionPageToInvoice`       |
| 상수명     | UPPER_SNAKE_CASE                           | `INVOICE_STATUS`, `NOTION_PROPERTY_NAMES`        |
| 변수명     | camelCase                                  | `invoiceId`, `clientName`                        |
| 타입명     | PascalCase                                 | `Invoice`, `InvoiceStatus`, `InvoiceApiResponse` |
| 인터페이스 | PascalCase                                 | `InvoiceItem`, `InvoiceApiResult`                |

### 들여쓰기 및 포맷팅

- **들여쓰기**: 2칸 (Prettier 설정됨)
- **세미콜론**: 자동 추가 (Prettier)
- **따옴표**: 작은따옴표 (Prettier)
- **줄 길이**: 80자 제한

### 주석 작성

- 한국어로 작성
- 함수/클래스 상단에 JSDoc 주석 추가
- 복잡한 로직은 인라인 주석으로 설명
- "TODO", "FIXME", "NOTE" 마크 사용 가능

## 파일별 상호작용 표준

### 필수 파일 일괄 수정 규칙

| 상황                 | 수정해야 할 파일                               | 설명                                                |
| -------------------- | ---------------------------------------------- | --------------------------------------------------- |
| **API 경로 추가**    | `src/constants/api.ts` + `src/app/api/**`      | API_PATHS 상수에 경로 추가, 라우트 파일 생성        |
| **Notion 속성 추가** | `src/lib/invoices.ts` + `src/types/invoice.ts` | NOTION_PROPERTY_NAMES, Invoice 인터페이스 동시 수정 |
| **환경 변수 추가**   | `src/constants/config.ts` + `.env.local`       | config에서만 접근하도록 강제                        |
| **에러 코드 추가**   | `src/lib/invoices.ts` (INVOICE_ERROR_CODES)    | 새 에러 타입 시 추가                                |
| **상태 추가**        | `src/types/invoice.ts` (INVOICE_STATUS)        | Invoice 로직 수정 필요                              |

## 상수 및 설정 관리

### src/constants/api.ts

```typescript
export const API_PATHS = {
  INVOICES: '/api/invoices',
  INVOICE_DETAIL: (id: string) => `/api/invoices/${id}`,
} as const
```

**규칙**:

- API 경로는 반드시 이 파일에서만 관리
- 하드코딩된 API 경로 금지
- 함수형 경로는 파라미터와 함께 정의

### src/constants/config.ts

```typescript
// 환경 변수는 이 파일을 통해서만 접근
export const config = {
  notionApiKey: process.env.NOTION_API_KEY!,
  notionDatabaseId: process.env.NOTION_DATABASE_ID!,
} as const
```

**규칙**:

- 환경 변수는 직접 접근 금지 (`process.env.XXX` 사용 금지)
- `src/constants/config.ts`를 통해서만 접근
- `.env.local` 파일은 git에 커밋 금지 (.gitignore 포함)

### 에러 코드 관리 (src/lib/invoices.ts)

```typescript
export const INVOICE_ERROR_CODES = {
  NOT_FOUND: 'INVOICE_NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  RATE_LIMITED: 'RATE_LIMITED',
  SERVER_ERROR: 'SERVER_ERROR',
} as const
```

**규칙**:

- 에러 타입은 상수 객체로 관리
- 에러 코드는 `UPPER_SNAKE_CASE`
- 에러 메시지는 한국어로 통일

## 타입 정의 표준 (src/types/invoice.ts)

```typescript
// 1. 상태 상수 + 타입
export const INVOICE_STATUS = {
  UNPAID: 'UNPAID',
  PAID: 'PAID',
  OVERDUE: 'OVERDUE',
  CANCELLED: 'CANCELLED',
} as const

export type InvoiceStatus = (typeof INVOICE_STATUS)[keyof typeof INVOICE_STATUS]

// 2. 메인 인터페이스
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

// 3. API 응답 타입
export interface InvoiceApiResponse {
  success: true
  data: Invoice
}

export type InvoiceApiResult = InvoiceApiResponse | InvoiceApiErrorResponse
```

**규칙**:

- 모든 API 응답은 `success` 필드 포함
- 선택적 필드는 `?` 마크 사용
- 유니온 타입은 `InvoiceApiResult` 형태로 정의

## Notion API 통합 표준

### 속성명 매핑 (src/lib/invoices.ts)

```typescript
export const NOTION_PROPERTY_NAMES = {
  invoiceNumber: '인보이스번호', // Notion DB 실제 컬럼명
  clientName: '고객명',
  amount: '금액',
  issueDate: '발급일',
  dueDate: '만기일',
  status: '상태',
  description: '설명',
} as const
```

**규칙**:

- Notion Database의 실제 컬럼명과 일치해야 함
- 코드에서는 영어 키, 값은 Notion 실제 컬럼명
- 속성명 변경 시 `NOTION_PROPERTY_NAMES`만 수정하면 모든 쿼리 영향

### 데이터 추출 헬퍼 함수 (src/lib/invoices.ts)

```typescript
function extractText(property?: any): string // 텍스트 타입
function extractNumber(property?: any): number // 숫자 타입
function extractDate(property?: any): string // 날짜 타입
```

**규칙**:

- Notion 속성 추출은 반드시 이 헬퍼 함수 사용
- 직접 접근 금지 (`properties.XXX?.value` 금지)

### Notion 클라이언트 (src/lib/notion.ts)

**규칙**:

- 싱글톤 패턴으로 클라이언트 관리
- `getNotionClient()` 함수로만 접근

## API 라우트 표준 (src/app/api/invoices/[id]/route.ts)

```typescript
// GET /api/invoices/[id]
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const { id } = await params // Next.js 15: 비동기 params
    const invoice = await getInvoiceById(id)
    return Response.json({
      success: true,
      data: invoice,
    })
  } catch (error: any) {
    // 에러 코드별 HTTP 상태 코드 매핑
    const statusMap = {
      [INVOICE_ERROR_CODES.NOT_FOUND]: 404,
      [INVOICE_ERROR_CODES.UNAUTHORIZED]: 401,
      [INVOICE_ERROR_CODES.RATE_LIMITED]: 429,
    }
    return Response.json(
      {
        success: false,
        error: {
          code: error.code,
          message: error.message,
        },
      },
      { status: statusMap[error.code] ?? 500 }
    )
  }
}
```

**규칙**:

- 미사용 파라미터는 언더스코어로 표시 (`_request`)
- Next.js 15.5.3: `params`는 Promise로 감싸야 함 (`await params`)
- 에러 응답은 `{ success: false, error: { code, message } }` 형식
- HTTP 상태 코드를 명확히 매핑

## 페이지 컴포넌트 표준 (src/app/invoices/[id]/page.tsx)

```typescript
// 서버 컴포넌트 (기본값)
export default async function InvoicePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const invoice = await getInvoiceById(id)

  return (
    // UI 렌더링
  )
}

// 동적 메타데이터
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return {
    title: `Invoice #${invoice.invoiceNumber}`,
  }
}
```

**규칙**:

- 서버 컴포넌트로 데이터 페칭 처리
- `async`/`await` 사용
- 에러는 Error Boundary로 처리
- 동적 메타데이터는 `generateMetadata` 함수로 정의

## UI 컴포넌트 표준

### shadcn/ui 컴포넌트

- **경로**: `src/components/ui/`
- **포함**: Button, Card, Input, Label 등
- **스타일**: TailwindCSS + CSS 변수 (new-york style)
- **아이콘**: Lucide Icons 사용

**규칙**:

- shadcn 컴포넌트는 수정 금지 (업데이트 호환성)
- 커스터마이징이 필요하면 새로운 컴포넌트 파일 생성
- 공통 스타일은 globals.css에서만 정의

### Tailwind CSS 클래스

```typescript
// ✅ 올바른 사용
className = 'flex items-center justify-between gap-4'

// ❌ 사용 금지 (매직 값)
className = 'flex items-center gap-[16px]'
```

**규칙**:

- Tailwind 기본 스케일 사용 (gap-4 = 1rem)
- 임의 값 사용 금지

## 상태 분기 처리 표준

```typescript
// Map 객체 사용 (권장)
const STATUS_STYLES = {
  PAID: 'bg-green-100 text-green-800',
  UNPAID: 'bg-yellow-100 text-yellow-800',
  OVERDUE: 'bg-red-100 text-red-800',
  CANCELLED: 'bg-gray-100 text-gray-800',
} as const

const className = STATUS_STYLES[invoice.status]

// ❌ 사용 금지 (if/switch 최소화)
if (status === 'PAID') {
  // ...
} else if (status === 'UNPAID') {
  // ...
}
```

**규칙**:

- 상태 분기는 Map 객체로 관리
- if/switch 문 최소화
- 여러 곳에서 사용되는 분기 로직은 constants에서 관리

## 금지 사항 (⛔ Prohibited Actions)

| 금지 사항                                         | 이유                       | 대체 방안                                            |
| ------------------------------------------------- | -------------------------- | ---------------------------------------------------- |
| `process.env.NOTION_API_KEY` 직접 접근            | 환경 변수 중앙 관리        | `src/constants/config.ts` 사용                       |
| API 경로 하드코딩 (`'/api/invoices/'`)            | 경로 일관성                | `API_PATHS` 상수 사용                                |
| switch/if로 상태 분기                             | 코드 중복 및 유지보수성    | Map 객체 사용                                        |
| Notion 속성에 직접 접근 (`properties.xxx?.value`) | 데이터 추출 오류           | `extractText()`, `extractNumber()` 등 헬퍼 함수 사용 |
| shadcn/ui 컴포넌트 수정                           | 업데이트 충돌              | 새로운 컴포넌트 파일 생성                            |
| 타입스크립트 `any` 타입 광범위 사용               | 타입 안전성                | 명시적 타입 정의 또는 `unknown` 사용                 |
| `.env.local` git 커밋                             | 보안 위험                  | `.gitignore`에 이미 포함                             |
| 임의 Tailwind 값 사용 (`gap-[16px]`)              | 디자인 일관성              | 기본 스케일 사용                                     |
| 서버 컴포넌트에서 상태 관리 (`useState`)          | Next.js 서버 컴포넌트 제약 | `'use client'` 지시문 + 클라이언트 컴포넌트          |

## AI 의사결정 기준

### 기능 추가 시 우선순위

1. **타입 정의**: `src/types/invoice.ts`에 먼저 정의
2. **상수 정의**: `src/constants/`, `src/lib/invoices.ts`에 추가
3. **로직 구현**: `src/lib/invoices.ts` 또는 라우트 파일
4. **UI 렌더링**: 페이지/컴포넌트에서 표시

### 파일 변경 영향도 분석

```
src/types/invoice.ts (타입 변경)
  ↓ 영향
- src/lib/invoices.ts (mapNotionPageToInvoice 함수)
- src/app/api/invoices/[id]/route.ts (응답 타입)
- src/app/invoices/[id]/page.tsx (렌더링 로직)
```

### 모호한 상황에서의 판단

| 상황                   | 판단 기준                                                | 예시                                           |
| ---------------------- | -------------------------------------------------------- | ---------------------------------------------- |
| 새 API 엔드포인트 추가 | `API_PATHS` + `src/app/api/` 라우트 파일                 | `src/constants/api.ts` 수정 + 라우트 파일 생성 |
| Notion DB 컬럼 추가    | `NOTION_PROPERTY_NAMES` 수정 + `Invoice` 인터페이스 수정 | 2개 파일 동시 수정                             |
| 새 상태 추가           | `INVOICE_STATUS` + `Invoice` + 분기 로직 수정            | `src/types/invoice.ts` + 관련 로직             |
| 에러 핸들링 추가       | `INVOICE_ERROR_CODES` 추가 + 라우트에서 처리             | `src/lib/invoices.ts` + 라우트 파일            |

## 개발 워크플로우

### 커밋 메시지

- 한국어로 작성
- 컨벤셔널 커밋 형식
- 예: `feat: 인보이스 상태별 필터링 기능 추가`, `fix: Notion API 응답 파싱 버그 해결`

### 린트 및 포맷팅

```bash
npm run lint      # ESLint 검사
npm run format    # Prettier 포맷팅
npm run build     # 빌드 테스트
```

**규칙**:

- Pre-commit 훅으로 자동 실행 (lint-staged)
- `npm run build`로 빌드 검증 필수

## 주요 의존성

| 패키지           | 버전     | 용도           |
| ---------------- | -------- | -------------- |
| next             | 15.5.3   | 프레임워크     |
| react            | 19.1.0   | UI 라이브러리  |
| typescript       | ^5       | 정적 타입 분석 |
| tailwindcss      | v4       | 스타일링       |
| @notionhq/client | ^2.3.0   | Notion API     |
| react-hook-form  | ^7.52.0  | 폼 관리        |
| zod              | ^3.23.8  | 스키마 검증    |
| lucide-react     | ^0.407.0 | 아이콘         |
| shadcn           | ^4.0.0   | UI 컴포넌트    |

## 참고 문서

- `README.md` - 설치 및 사용 가이드
- `docs/PRD.md` - 제품 요구사항 명세
- `docs/ROADMAP.md` - 개발 로드맵
- `CLAUDE.md` - 프로젝트 개발 지침
