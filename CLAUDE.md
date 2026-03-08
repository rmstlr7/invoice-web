# 🤖 Claude Code 개발 지침

**Invoice Web**은 Notion Database 기반의 인보이스 조회 및 PDF 다운로드 서비스입니다.

클라이언트가 고유 링크를 통해 인보이스를 안전하게 확인하고 PDF로 다운로드할 수 있는 애플리케이션입니다.

## 🎯 프로젝트 개요

- **명칭**: Invoice Web
- **기술 스택**: Next.js 15.5.3 + React 19 + TailwindCSS + Notion API
- **주요 기능**:
  - 인보이스 상세 조회 (F001)
  - 상태별 시각 표시 (F002)
  - PDF 다운로드 (F003)

## 🛠️ 핵심 기술 스택

- **Framework**: Next.js 15.5.3 (App Router)
- **Runtime**: React 19.1.0 + TypeScript 5
- **Styling**: TailwindCSS v4 + shadcn/ui (new-york style)
- **API Integration**: @notionhq/client ^2.3.0
- **Forms**: React Hook Form + Zod + Server Actions
- **UI Components**: Radix UI + Lucide Icons
- **Development**: ESLint + Prettier + Husky + lint-staged

## 📋 주요 문서

- [README.md](./README.md) - 설치 및 사용 가이드
- [PRD (제품 요구사항)](./docs/PRD.md) - 기능 명세 및 요구사항
- [ROADMAP (로드맵)](./docs/ROADMAP.md) - 개발 로드맵

💡 **상세 규칙은 위 개발 가이드 문서들을 참조하세요**
