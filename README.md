# 📄 Invoice Web

Notion에 저장된 인보이스를 클라이언트가 안전하게 웹으로 확인하고 PDF로 다운로드할 수 있는 서비스입니다.

## 🎯 핵심 기능

| 기능     | 설명               |
| -------- | ------------------ | ---------------------------------------------- |
| **F001** | 인보이스 상세 조회 | Notion DB에서 인보이스 정보 조회 및 표시       |
| **F002** | 인보이스 상태 표시 | 미납/납부완료/연체/취소 상태를 시각적으로 표시 |
| **F003** | PDF 다운로드       | 인보이스를 PDF 파일로 다운로드                 |

## 🚶 사용자 여정

```
1. 발급자: Notion Database에 인보이스 정보 입력
   ↓ [고유 URL 생성/공유]
2. 클라이언트: 공유받은 URL 접속
   ↓
3. 인보이스 상세 페이지에서 확인
   ├─ 고객명, 금액, 발급일, 만기일 확인
   ├─ 인보이스 상태 확인
   ↓ [PDF 다운로드 버튼 클릭]
4. PDF 생성 & 다운로드 완료
```

## 🛠️ 기술 스택

### 프론트엔드

- **Next.js 15.5.3** (App Router) - React 풀스택 프레임워크
- **React 19.1.0** - UI 라이브러리
- **TypeScript 5.6+** - 타입 안전성

### 스타일링 & UI

- **TailwindCSS v4** - 유틸리티 우선 CSS
- **shadcn/ui** - 고품질 React 컴포넌트
- **Lucide React** - 아이콘 라이브러리
- **Geist 폰트** - Next.js 기본 폰트

### 데이터 & 통합

- **@notionhq/client ^2.3.0** - Notion API 클라이언트
- **Notion Database** - 인보이스 데이터 저장소

### PDF 생성

- **@react-pdf/renderer** 또는 **pdfkit** - PDF 생성 라이브러리 (예정)

### 개발 도구

- **ESLint + Prettier** - 코드 품질 및 포맷팅
- **Husky + lint-staged** - Pre-commit 훅
- **npm** - 패키지 관리자

## 📋 설치 및 실행

### 1. 저장소 클론

```bash
git clone <repository-url>
cd invoice-web
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

`.env.local` 파일을 프로젝트 루트에 생성하고 다음 정보를 입력하세요:

```env
# Notion API 설정
NOTION_API_KEY=your_notion_api_key
NOTION_DATABASE_ID=your_notion_database_id
```

**Notion API 키 획득 방법:**

1. [Notion Developers](https://www.notion.so/my-integrations) 접속
2. 새로운 Integration 생성
3. 생성된 API 키 복사
4. Notion Database와 Integration 연결

### 4. 개발 서버 실행

```bash
npm run dev
```

`http://localhost:3000`에서 확인할 수 있습니다.

### 5. 프로덕션 빌드

```bash
npm run build
npm start
```

## 📁 프로젝트 구조

```
invoice-web/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # 루트 레이아웃
│   │   ├── page.tsx            # 홈 페이지
│   │   ├── invoices/
│   │   │   └── [id]/
│   │   │       └── page.tsx    # 인보이스 상세 페이지
│   │   └── api/
│   │       └── invoices/[id]/
│   │           └── route.ts    # 인보이스 API 라우트
│   ├── components/
│   │   └── ui/                 # shadcn UI 컴포넌트
│   ├── lib/
│   │   ├── invoices.ts         # 인보이스 비즈니스 로직
│   │   ├── notion.ts           # Notion 클라이언트
│   │   └── utils.ts            # 유틸리티 함수
│   ├── types/
│   │   └── invoice.ts          # 타입 정의
│   └── constants/
│       ├── api.ts              # API 경로 상수
│       └── config.ts           # 환경 설정
├── docs/
│   └── PRD.md                  # 제품 요구사항 명세서
├── .env.local                  # 환경 변수 (git 제외)
├── CLAUDE.md                   # 개발 지침
└── README.md                   # 이 파일
```

## 📊 Notion Database 스키마

Invoice 테이블에 다음 필드가 필요합니다:

| 필드         | 타입   | 설명                          |
| ------------ | ------ | ----------------------------- |
| id           | UUID   | Notion 페이지 ID (자동)       |
| 인보이스번호 | Text   | 인보이스 번호                 |
| 고객명       | Text   | 클라이언트 이름               |
| 금액         | Number | 청구 금액 (원화)              |
| 발급일       | Date   | 인보이스 발급일               |
| 만기일       | Date   | 결제 예정일                   |
| 상태         | Select | 미납 / 납부완료 / 연체 / 취소 |
| 설명         | Text   | 추가 설명 (선택사항)          |

## 🔗 페이지 라우트

| 경로                 | 설명                 |
| -------------------- | -------------------- |
| `/`                  | 홈 페이지            |
| `/invoices/[id]`     | 인보이스 상세 페이지 |
| `/api/invoices/[id]` | 인보이스 API (JSON)  |

## 🔐 보안

- Notion API 토큰은 **환경 변수에만 저장** (.env.local)
- `.env.local`은 `.gitignore`에 포함되어 있습니다
- 공개 URL은 충분히 긴 고유 ID 사용 (추측 불가능)

## 📝 개발 명령어

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# 린트 검사
npm run lint

# 린트 자동 수정
npm run lint -- --fix

# 포맷팅 (Prettier)
npm run format
```

## 🐛 알려진 제약사항

- PDF 다운로드는 아직 구현 중입니다 (F003)
- 인보이스 검색/목록 기능은 MVP 이후 지원 예정

## 📚 참고 문서

- [PRD (제품 요구사항)](./docs/PRD.md)
- [CLAUDE.md (개발 지침)](./CLAUDE.md)
- [Next.js 공식 문서](https://nextjs.org/docs)
- [Notion API 문서](https://developers.notion.com/)

## 📄 라이선스

이 프로젝트는 내부 사용을 위한 프로젝트입니다.

---

**마지막 업데이트**: 2026-03-08
