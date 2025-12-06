// app/support/success/page.tsx
"use client";

import { useSearchParams } from "next/navigation";

export default function SupportSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f4ece4]">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-lg px-8 py-10 text-center text-[#6b3d33]">
        <h1 className="text-2xl font-bold mb-4">ご支援ありがとうございます</h1>
        <p className="text-sm mb-4">
          決済が正常に完了しました。新郎新婦の新生活のスタートを一緒に応援していただき、
          本当にありがとうございます。
        </p>

        {sessionId && (
          <p className="text-[11px] text-[#8b5a4a] mt-2">
            お問い合わせの際は、セッション ID：
            <span className="font-mono break-all">{sessionId}</span>
            をお伝えください。
          </p>
        )}

        <a
          href="/projects/test" // TODO: 実際は元のプロジェクトページに戻す
          className="inline-block mt-6 rounded-full bg-[#6b3d33] text-white px-6 py-2 text-sm font-semibold hover:bg-[#5a3029] transition"
        >
          ギフトページに戻る
        </a>
      </div>
    </main>
  );
}
