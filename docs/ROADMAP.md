# 📋 Invoice Web 개발 로드맵

**Invoice Web** 프로젝트의 개발 진행 상황과 향후 계획을 관리하는 로드맵입니다.

---

## 📊 프로젝트 진행률

| Phase   | 이름               | 상태      | 진행률 |
| ------- | ------------------ | --------- | ------ |
| Phase 1 | 프로젝트 초기 설정 | ✅ 완료   | 100%   |
| Phase 2 | 공통 모듈 개발     | ✅ 완료   | 100%   |
| Phase 3 | 핵심 기능 개발     | 🔄 진행중 | 0%     |
| Phase 4 | PDF 다운로드 기능  | ⬜ 예정   | 0%     |
| Phase 5 | 최적화 및 배포     | ⬜ 예정   | 0%     |

---

## Phase 1: 프로젝트 초기 설정 ✅ (완료)

**예상 소요 시간**: ~2시간
**완료 일시**: 2026-03-08

### 개요

Next.js 기반의 프로젝트 초기 구조를 설정하고, 개발 환경을 구성합니다.

### 완료된 태스크

- [x] Next.js 15.5.3 프로젝트 생성
- [x] React 19.1.0, TypeScript 5 설정
- [x] TailwindCSS v4 초기화 (@tailwindcss/postcss)
- [x] shadcn/ui 설정 (new-york style)
- [x] ESLint, Prettier 설정
- [x] Husky + lint-staged 설정 (pre-commit 훅)
- [x] 기본 레이아웃 구조 생성 (`src/app/layout.tsx`)
- [x] 환경 변수 관리 구조 (constants/config.ts)
- [x] API 경로 상수화 (constants/api.ts)
- [x] 기본 UI 컴포넌트 (Button, Card, Input, Label)

### 완료 기준 ✅

- [x] `npm run build` 성공
- [x] `npm run dev` 실행 및 localhost:3000 접속 가능
- [x] `npm run lint` 0 errors, 0 warnings
- [x] git commit `062aaa0` 완료

---

## Phase 2: 공통 모듈 개발 ✅ (완료)

**예상 소요 시간**: ~4시간
**완료 일시**: 2026-03-08

### 개요

Notion API 연동을 위한 공통 모듈과 타입 정의를 구현합니다.

### 완료된 태스크

- [x] Notion API 클라이언트 구현 (`src/lib/notion.ts`)
  - 싱글톤 패턴으로 인스턴스 관리
- [x] 인보이스 조회 로직 구현 (`src/lib/invoices.ts`)
  - `getInvoiceById(id)` - Notion 페이지 ID로 직접 조회
  - `getInvoiceByNumber(number)` - 인보이스 번호로 검색
  - `getAllInvoices(cursor?)` - 전체 목록 조회 + 페이지네이션
  - `mapNotionPageToInvoice()` - Notion 페이지→인보이스 타입 변환
- [x] 타입 정의 (`src/types/invoice.ts`)
  - `INVOICE_STATUS` enum (UNPAID, PAID, OVERDUE, CANCELLED)
  - `Invoice` 인터페이스
  - API 응답 타입 정의
- [x] API 라우트 구현 (`src/app/api/invoices/[id]/route.ts`)
  - GET 핸들러: 인보이스 데이터 JSON 응답
  - 에러 처리 (404, 401, 429, 500)
  - Next.js 15 비동기 params 처리
- [x] 환경 변수 설정 (`.env.local`)
  - `NOTION_API_KEY`
  - `NOTION_DATABASE_ID`
- [x] Notion DB 속성명 상수화 (`NOTION_PROPERTY_NAMES`)
  - invoiceNumber, clientName, amount, issueDate, dueDate, status, description

### 완료 기준 ✅

- [x] API 라우트에서 JSON 응답 정상 반환
- [x] TypeScript 타입 안전성 확보
- [x] 에러 처리 정상 동작 확인

---

## Phase 3: 핵심 기능 개발 🔄 (진행중)

**예상 소요 시간**: ~6시간
**상태**: 시작 전 대기

### 개요

인보이스 상세 페이지와 홈 페이지 UI를 완성하여 사용자가 인보이스를 조회할 수 있도록 구현합니다.

### 구현 대상 기능

- **F001**: 인보이스 상세 조회 (Notion DB 데이터 표시)
- **F002**: 상태별 시각 표시 (배지 + 색상)
- **F011**: 홈 페이지 조회 가이드

### 예정된 태스크

- [ ] 인보이스 상세 페이지 UI 완성 (`src/app/invoices/[id]/page.tsx`)
  - [x] 서버 컴포넌트 구조 (이미 구현됨)
  - [x] 인보이스 데이터 조회 및 표시 (이미 구현됨)
  - [ ] UI/UX 최종 검수 및 반응형 디자인 확인
  - [ ] 접근성(accessibility) 검수
- [ ] 홈 페이지 인보이스 조회 가이드 완성 (`src/app/page.tsx`)
  - [x] 홈 페이지 리디자인 완료 (이미 구현됨)
  - [ ] 사용자 가이드 텍스트 및 예시 추가
- [ ] 404 에러 페이지 구현 (`src/app/invoices/[id]/not-found.tsx`)
  - [ ] 존재하지 않는 인보이스 접근 시 처리
- [ ] 500 에러 페이지 구현 (`src/app/error.tsx`)
  - [ ] API 오류 발생 시 사용자 친화적 메시지 표시
- [ ] 메타데이터 최적화 (Open Graph, Twitter Card)

### 완료 기준

- [ ] Notion DB 데이터가 페이지에 올바르게 표시됨
- [ ] 모든 상태(PAID, UNPAID, OVERDUE, CANCELLED) 시각화 정상 동작
- [ ] 응답형 디자인 (모바일/태블릿/데스크탑) 확인
- [ ] `npm run build` 성공
- [ ] `npm run lint` 0 errors, 0 warnings

---

## Phase 4: PDF 다운로드 기능 개발 ⬜ (예정)

**예상 소요 시간**: ~8시간
**상태**: 계획 단계

### 개요

인보이스를 PDF 파일로 생성하고 다운로드 기능을 구현합니다.

### 구현 대상 기능

- **F003**: PDF 다운로드

### 예정된 태스크

- [ ] PDF 생성 라이브러리 선택 및 설치
  - `@react-pdf/renderer` 또는 `pdfkit` 평가
  - 의존성 추가 및 설정
- [ ] PDF 생성 API 라우트 구현 (`src/app/api/invoices/[id]/pdf/route.ts`)
  - GET 핸들러: 인보이스 PDF 생성 및 반환
  - 에러 처리 (404, 500)
- [ ] PDF 템플릿 디자인 (`src/lib/pdf-template.ts`)
  - 인보이스 헤더 (회사명, 로고, 연락처)
  - 인보이스 상세 정보
  - 결제 정보 섹션
  - 각주 및 유의사항
- [ ] 상세 페이지에 PDF 다운로드 버튼 추가
  - 버튼 UI 구현 및 스타일링
  - 클릭 시 PDF 다운로드 트리거
- [ ] 다운로드 파일명 규칙 설정
  - 예: `invoice_INV-001_2024-03-08.pdf`

### 완료 기준

- [ ] 브라우저에서 PDF 파일 다운로드 성공
- [ ] PDF 내용이 인보이스 데이터를 정확하게 반영
- [ ] 한글 폰트 정상 렌더링
- [ ] 다운로드 성능 최적화 (생성 시간 < 2초)

---

## Phase 5: 최적화 및 배포 ⬜ (예정)

**예상 소요 시간**: ~4시간
**상태**: 계획 단계

### 개요

성능 최적화, 반응형 디자인 최종 검수, Vercel 배포를 진행합니다.

### 예정된 태스크

- [ ] 성능 최적화
  - [ ] Next.js ISR (Incremental Static Regeneration) 적용
  - [ ] 이미지 최적화 (next/image)
  - [ ] 캐싱 전략 수립 (Cache-Control 헤더)
  - [ ] 번들 크기 분석 및 최적화
- [ ] 반응형 디자인 최종 검수
  - [ ] 모바일 (375px, 425px)
  - [ ] 태블릿 (768px, 1024px)
  - [ ] 데스크탑 (1280px 이상)
  - [ ] 주요 브라우저 호환성 테스트
- [ ] SEO 최적화
  - [ ] 메타데이터 설정 (title, description)
  - [ ] Open Graph 태그 (og:title, og:image)
  - [ ] Twitter Card 설정
  - [ ] robots.txt, sitemap.xml
- [ ] 보안 검수
  - [ ] HTTPS 설정 확인
  - [ ] XSS, CSRF 방어 검증
  - [ ] 환경 변수 보안 확인
  - [ ] API 레이트 리미팅
- [ ] Vercel 배포 설정
  - [ ] Vercel 프로젝트 생성
  - [ ] 환경 변수 설정 (NOTION_API_KEY, NOTION_DATABASE_ID)
  - [ ] CI/CD 파이프라인 설정
  - [ ] 프로덕션 빌드 검증
- [ ] 모니터링 및 로깅 설정
  - [ ] Vercel Analytics 활성화
  - [ ] 에러 트래킹 (Sentry 등)
  - [ ] 성능 메트릭 모니터링

### 완료 기준

- [ ] Vercel 프로덕션 URL 접속 가능
- [ ] 모든 기능이 정상 동작 (상세 페이지, PDF 다운로드 등)
- [ ] Lighthouse 성능 점수 > 90
- [ ] Core Web Vitals 개선 (LCP, FID, CLS)

---

## 📝 개발 규칙

### 코딩 스타일

- 들여쓰기: 2칸
- 변수/함수명: 영어
- 코멘트: 한국어
- TypeScript strict mode 사용

### 커밋 컨벤션

- 형식: `[타입]: 한국어 설명`
- 예: `feat: Phase 3 인보이스 상세 페이지 UI 완성`
- 타입: feat, fix, refactor, docs, style, test, perf

### 하드코딩 방지

- 매직 스트링/숫자는 `constants/` 에서 관리
- 환경 변수는 `.env.local` 에서만 로드
- API 경로는 `constants/api.ts` 에서 정의
- 상태 분기는 Map 객체 또는 enum 사용

### PR (Pull Request)

- 각 Phase 단위로 PR 생성
- 상세한 description 작성 (완료 기준, 테스트 방법)
- 최소 1명의 리뷰 후 merge

---

## 🔗 관련 문서

- [PRD.md](./PRD.md) - 제품 요구사항 명세서
- [README.md](../README.md) - 설치 및 사용 가이드
- [CLAUDE.md](../CLAUDE.md) - 개발 지침 및 프로젝트 정보

---

## 📞 연락처 및 지원

프로젝트 관련 질문이나 제안은 Issue를 통해 등록해주세요.
