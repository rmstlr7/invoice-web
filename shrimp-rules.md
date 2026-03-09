# Invoice Web - AI 개발 표준

## 개요

**Invoice Web**은 Notion Database 기반의 인보이스 조회 및 PDF 다운로드 서비스입니다.

- **기술 스택**: Next.js 15.5.3, React 19, TypeScript 5, TailwindCSS v4, Notion API
- **UI Framework**: shadcn/ui (new-york style)
- **핵심 기능**: 인보이스 상세 조회, 상태별 시각 표시, PDF 다운로드

---

## 프로젝트 아키텍처

### 디렉토리 구조

```
src/
├── app/                    # Next.js App Router
│   ├── api/invoices/[id]/  # API 라우트 (JSON 응답)
│   ├── invoices/[id]/      # 상세 페이지 (서버 컴포넌트)
│   ├── layout.tsx          # 루트 레이아웃
│   └── globals.css         # 전역 스타일
├── components/ui/          # shadcn/ui 컴포넌트 (수정 금지)
├── constants/              # 상수 관리 (중앙 집중)
│   ├── api.ts              # API 경로
│   └── config.ts           # 환경 설정
├── lib/                    # 비즈니스 로직
│   ├── notion.ts           # Notion 클라이언트
│   ├── invoices.ts         # 인보이스 조회 로직
│   └── utils.ts            # 유틸리티
└── types/                  # 타입 정의
    └── invoice.ts          # 인보이스 관련 타입/enum
```

---

## 코드 표준

### 1. 파일명 규칙

| 파일 타입           | 규칙              | 예시                        |
| ------------------- | ----------------- | --------------------------- |
| React 컴포넌트      | PascalCase        | `InvoiceDetail.tsx`         |
| 페이지              | PascalCase (자동) | `[id]/page.tsx`             |
| API 라우트          | route.ts          | `[id]/route.ts`             |
| 유틸리티/라이브러리 | camelCase         | `getInvoiceById.ts`         |
| 타입 파일           | 단수형            | `invoice.ts` (Invoice 타입) |
| 상수 파일           | 전체 소문자       | `api.ts`, `config.ts`       |

### 2. 변수명 규칙

- **변수/함수**: camelCase
- **상수**: UPPER_SNAKE_CASE (또는 최상위 const는 camelCase)
- **타입/Interface**: PascalCase
- **Enum**: PascalCase (멤버는 UPPER_SNAKE_CASE)

### 3. 들여쓰기

- **공백**: 2칸 (혼용 금지)

### 4. 주석

- 한국어 사용
- 선택: 비자명한 로직에만 작성
- 포맷: `// 주석` 또는 `/** JSDoc */`

---

## 파일 상호작용 표준

### 핵심 원칙

**상수를 수정할 때는 해당 상수를 사용하는 모든 파일을 함께 검토 및 수정해야 합니다.**

### 주요 상호작용 맵핑

#### 1. API 경로 변경

| 변경 파일              | 함께 수정할 파일                     | 사유                 |
| ---------------------- | ------------------------------------ | -------------------- |
| `src/constants/api.ts` | `src/app/api/invoices/[id]/route.ts` | API 경로 참조        |
|                        | 클라이언트 코드 (fetch 호출)         | API 경로 동기화 필요 |

**예**: `INVOICE_API_PATH` 수정 시 해당 경로를 사용하는 모든 fetch 호출 확인

#### 2. 환경변수 추가

| 변경 파일    | 함께 수정할 파일           | 사유                  |
| ------------ | -------------------------- | --------------------- |
| `.env.local` | `src/constants/config.ts`  | 환경변수 정의 및 검증 |
|              | 사용처 파일 (lib/\*.ts 등) | config.ts 경유로 접근 |

**예**: NOTION_API_KEY 추가 시 → config.ts에서 접근 → lib/notion.ts에서 사용

#### 3. 인보이스 필드 추가

| 변경 파일                        | 함께 수정할 파일                        | 순서 |
| -------------------------------- | --------------------------------------- | ---- |
| `src/types/invoice.ts`           | 1. 타입 정의                            |
| `src/lib/invoices.ts`            | 2. NOTION_PROPERTY_NAMES (속성명)       |
|                                  | 3. mapNotionPageToInvoice() (변환 로직) |
| `src/app/invoices/[id]/page.tsx` | 4. 렌더링 코드                          |

**예**: 새 필드 `department` 추가

```typescript
// 1. types/invoice.ts: Invoice 인터페이스에 department 추가
// 2. lib/invoices.ts: NOTION_PROPERTY_NAMES.department = "부서"
// 3. lib/invoices.ts: mapNotionPageToInvoice()에서 page.properties.department 매핑
// 4. page.tsx: <div>{invoice.department}</div> 렌더링
```

#### 4. Notion DB 속성명 변경

| 변경 파일      | 함께 수정할 파일                              | 사유               |
| -------------- | --------------------------------------------- | ------------------ |
| 실제 Notion DB | `src/lib/invoices.ts` (NOTION_PROPERTY_NAMES) | 속성명 상수 동기화 |

**주의**: Notion DB의 실제 속성명과 NOTION_PROPERTY_NAMES의 값이 일치해야 함

#### 5. 상태값(status) 변경

| 변경 파일                                    | 함께 수정할 파일                                 | 사유               |
| -------------------------------------------- | ------------------------------------------------ | ------------------ |
| `src/types/invoice.ts` (INVOICE_STATUS enum) | `src/lib/invoices.ts`                            | status 값 검증     |
|                                              | `src/app/invoices/[id]/page.tsx` (STATUS_STYLES) | 상태별 스타일 매핑 |

---

## 상수 관리 표준 (중앙 집중)

### ❌ 금지 패턴

```typescript
// ❌ 하드코딩 금지
const url = `/api/invoices/${id}`
const status = 'PAID'
const propertyName = '인보이스번호'
```

### ✅ 필수 패턴

#### 1. API 경로 (constants/api.ts)

```typescript
// src/constants/api.ts
export const API_ENDPOINTS = {
  INVOICE: (id: string) => `/api/invoices/${id}`,
  INVOICES_LIST: '/api/invoices',
} as const

// 사용처
const url = API_ENDPOINTS.INVOICE(id)
```

#### 2. 환경 설정 (constants/config.ts)

```typescript
// src/constants/config.ts
export const CONFIG = {
  NOTION_API_KEY: process.env.NOTION_API_KEY || '',
  NOTION_DATABASE_ID: process.env.NOTION_DATABASE_ID || '',
} as const

// ✅ 올바른 사용
const client = new Client({ auth: CONFIG.NOTION_API_KEY })

// ❌ 금지: process.env 직접 접근
const client = new Client({ auth: process.env.NOTION_API_KEY })
```

#### 3. 상태값 (types/invoice.ts)

```typescript
// src/types/invoice.ts
export enum INVOICE_STATUS {
  UNPAID = 'UNPAID',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
}

export interface Invoice {
  status: INVOICE_STATUS;
}

// 사용처
if (invoice.status === INVOICE_STATUS.PAID) { ... }
```

#### 4. Notion 속성명 (lib/invoices.ts)

```typescript
// src/lib/invoices.ts
export const NOTION_PROPERTY_NAMES = {
  invoiceNumber: '인보이스번호',
  clientName: '고객명',
  amount: '금액',
  status: '상태',
  // ... 기타 속성
} as const

// 사용처
const invoiceNumber = page.properties[NOTION_PROPERTY_NAMES.invoiceNumber]
```

#### 5. 오류 코드 (lib/invoices.ts)

```typescript
// src/lib/invoices.ts
export const INVOICE_ERROR_CODES = {
  NOT_FOUND: 'INVOICE_NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  RATE_LIMIT: 'RATE_LIMIT_EXCEEDED',
  SERVER_ERROR: 'SERVER_ERROR',
} as const
```

---

## 상태 분기 표준

### ❌ 금지 패턴

```typescript
// ❌ if/switch로 매직 스트링 비교
if (status === 'PAID') { ... }
else if (status === 'UNPAID') { ... }
```

### ✅ 필수 패턴 (Map 객체)

```typescript
// src/app/invoices/[id]/page.tsx
const STATUS_STYLES = {
  [INVOICE_STATUS.PAID]: {
    label: '납부완료',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    badgeColor: 'bg-green-500',
  },
  [INVOICE_STATUS.UNPAID]: {
    label: '미납',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    badgeColor: 'bg-yellow-500',
  },
  // ...
} as const

// 사용처
const styles = STATUS_STYLES[invoice.status]
```

---

## Next.js 15 특수성

### 1. 비동기 Params

Next.js 15에서 route params는 Promise입니다.

```typescript
// ✅ 올바른 타입
interface Params {
  id: string
}
export async function Page({ params }: { params: Promise<Params> }) {
  const { id } = await params
}

// API Route에서도 동일
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
}

// ❌ 잘못된 사용 (Promise를 기다리지 않음)
const id = params.id // TypeError
```

### 2. 서버 컴포넌트

- `src/app/invoices/[id]/page.tsx`는 기본적으로 서버 컴포넌트
- 직접 DB/API 호출 가능
- `'use client'` 지시문 없음

### 3. API 라우트

- `src/app/api/invoices/[id]/route.ts`는 자동으로 Route Handler
- 요청/응답 처리 필요

---

## Notion API 연동 표준

### 1. Notion 클라이언트 (lib/notion.ts)

```typescript
// lib/notion.ts
import { Client } from '@notionhq/client'
import { CONFIG } from '@/constants/config'

let notionClient: Client | null = null

export function getNotionClient(): Client {
  if (!notionClient) {
    notionClient = new Client({ auth: CONFIG.NOTION_API_KEY })
  }
  return notionClient
}
```

### 2. 데이터 조회 (lib/invoices.ts)

```typescript
// 세 가지 조회 방식 제공
- getInvoiceById(id): 페이지 ID로 직접 조회 (빠름)
- getInvoiceByNumber(number): 인보이스 번호로 검색 (필터링)
- getAllInvoices(cursor?): 전체 목록 + 페이지네이션
```

### 3. 데이터 변환

```typescript
// mapNotionPageToInvoice(page: PageObjectResponse): Invoice
// - Notion 페이지 객체 → Invoice 타입으로 변환
// - 타입 검증 및 에러 처리 포함
```

### 4. 에러 처리

```typescript
// INVOICE_ERROR_CODES 사용
- NOT_FOUND: 인보이스 미발견 (404)
- UNAUTHORIZED: Notion 인증 실패 (401)
- RATE_LIMIT_EXCEEDED: API 할당량 초과 (429)
- SERVER_ERROR: 기타 서버 오류 (500)
```

---

## 금지 사항 (Prohibited Actions)

### 1. 하드코딩 ❌

```typescript
// ❌ 금지
const path = '/api/invoices/'
const notionKey = 'your-key-here'
const status = 'PAID'

// ✅ 필수
import { API_ENDPOINTS } from '@/constants/api'
import { CONFIG } from '@/constants/config'
import { INVOICE_STATUS } from '@/types/invoice'
```

### 2. 환경변수 직접 접근 ❌

```typescript
// ❌ 금지
process.env.NOTION_API_KEY

// ✅ 필수
import { CONFIG } from '@/constants/config'
CONFIG.NOTION_API_KEY
```

### 3. shadcn/ui 컴포넌트 수정 ❌

- `src/components/ui/` 내 파일은 읽기 전용
- 버그: 업스트림 업데이트로 덮어씌워짐
- 커스터마이징: wrapper 컴포넌트 생성

```typescript
// ❌ 금지
// src/components/ui/button.tsx 수정

// ✅ 필수
// src/components/InvoiceButton.tsx (wrapper)
import { Button } from '@/components/ui/button';

export function InvoiceButton(props) {
  return <Button {...props} className="custom-class" />;
}
```

### 4. 매직 Number/String ❌

```typescript
// ❌ 금지
if (items.length > 10) { ... }
const timeout = 5000;
const currency = 'KRW';

// ✅ 필수
export const PAGINATION_LIMIT = 10;
export const API_TIMEOUT_MS = 5000;
export const CURRENCY = 'KRW' as const;
```

### 5. if/switch 남발 ❌

```typescript
// ❌ 금지 (상태별 분기)
if (status === 'PAID') {
  return <GreenBadge />;
} else if (status === 'UNPAID') {
  return <YellowBadge />;
}

// ✅ 필수 (Map 사용)
const BADGE_MAP = { [INVOICE_STATUS.PAID]: GreenBadge, ... };
return createElement(BADGE_MAP[status]);
```

### 6. 런타임에 타입 검증 없이 API 응답 사용 ❌

```typescript
// ❌ 금지
const invoice = data // Notion 응답을 바로 사용

// ✅ 필수
const invoice = mapNotionPageToInvoice(data) // 변환 + 타입 검증
```

---

## AI 의사결정 기준

### 1. 파일 생성 vs 수정

| 상황                         | 판단                                         |
| ---------------------------- | -------------------------------------------- |
| 새 기능 (새 라우트, 새 타입) | 파일 생성                                    |
| 기존 기능 개선/버그 수정     | 파일 수정                                    |
| 상수 추가                    | constants/ 폴더에 추가 또는 기존 파일에 병합 |

### 2. 파일 위치 결정

| 내용           | 폴더               |
| -------------- | ------------------ |
| React 컴포넌트 | `src/components/`  |
| API 라우트     | `src/app/api/`     |
| 페이지         | `src/app/[route]/` |
| 비즈니스 로직  | `src/lib/`         |
| 타입/Enum      | `src/types/`       |
| 상수           | `src/constants/`   |

### 3. Notion 필드 추가 우선순위

1. Notion DB에서 실제 속성명 확인
2. `types/invoice.ts`에 타입 추가
3. `lib/invoices.ts`의 NOTION_PROPERTY_NAMES에 추가
4. `lib/invoices.ts`의 mapNotionPageToInvoice()에서 매핑
5. 사용처 페이지에 렌더링 추가
6. 테스트 (빌드, 린트)

### 4. 에러 처리

- Notion API 에러: INVOICE_ERROR_CODES 사용
- HTTP 상태 코드: 404, 401, 429, 500 구분
- 클라이언트 에러: UI 메시지로 표시

---

## 체크리스트

### 파일 수정 후

- [ ] 타입 검증: `npm run build` ✅
- [ ] 린트 검사: `npm run lint` ✅
- [ ] 관련 파일 동기화 확인
- [ ] 상수 사용 규칙 준수 확인
- [ ] 새 파일 생성 시 올바른 폴더 위치 확인

### 새 기능 추가 후

- [ ] 타입 먼저 정의 (types/)
- [ ] 상수 정의 (constants/)
- [ ] 로직 구현 (lib/ 또는 app/)
- [ ] 렌더링 (page.tsx)
- [ ] 빌드/린트 통과
- [ ] 모든 관련 파일 동기화

---

## 참고 문서

- `CLAUDE.md` - 프로젝트 개발 지침
- `docs/PRD.md` - 제품 요구사항
- `docs/ROADMAP.md` - 개발 로드맵
- `README.md` - 설치/사용 가이드
