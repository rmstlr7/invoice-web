import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 py-12">
      <div className="mx-auto max-w-2xl px-4">
        {/* 헤더 */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-white">
            인보이스 조회 시스템
          </h1>
          <p className="mt-3 text-gray-400">
            노션 기반 인보이스 관리 시스템에 오신 것을 환영합니다.
          </p>
        </div>

        {/* 인보이스 조회 방법 */}
        <Card className="mb-6 border-gray-800 bg-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <span>📋</span>
              인보이스 조회 방법
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-white">
                1. 인보이스 워크 방법
              </h3>
              <p className="mt-2 text-sm text-gray-400">
                링크를 받으면 이 웹페이지에서 내 인보이스 정보를 안전하게 확인할
                수 있습니다.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white">2. 인보이스 확인</h3>
              <p className="mt-2 text-sm text-gray-400">
                링크를 클릭하면 인보이스 내용을 표시해 드릴 수 있습니다.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white">3. PDF 다운로드</h3>
              <p className="mt-2 text-sm text-gray-400">
                인보이스 페이지에서 PDF 다운로드 버튼을 클릭해 파일을 저장하거나
                인쇄할 수 있습니다.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 인보이스 URL 예시 */}
        <Card className="mb-6 border-gray-800 bg-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <span>🔗</span>
              인보이스 URL 예시
            </CardTitle>
          </CardHeader>
          <CardContent>
            <code className="block rounded bg-gray-800 px-4 py-3 text-sm text-gray-200">
              https://yourdomain.com/invoices/[인보이스ID]
            </code>
            <p className="mt-3 text-sm text-gray-400">
              발급자가 보낸 링크에 있는 [인보이스ID] 부분에 고유의 ID가
              입력됩니다.
            </p>
          </CardContent>
        </Card>

        {/* 문제 해결 */}
        <Card className="border-gray-800 bg-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <span>❓</span>
              문제가 있나요?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400">
              인보이스를 찾을 수 없거나 링크가 작동하지 않으면, 인보이스를
              발급한 담당자에게 연락하세요. 발급자가 정확한 링크를 제공해드릴
              것입니다.
            </p>
          </CardContent>
        </Card>

        {/* 푸터 */}
        <div className="mt-12 border-t border-gray-800 pt-8 text-center">
          <p className="text-xs text-gray-500">
            © 2025 Invoice Web. All rights reserved.
          </p>
        </div>
      </div>
    </main>
  )
}
