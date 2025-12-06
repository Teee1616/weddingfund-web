// app/support/cancel/page.tsx
export default function SupportCancelPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f4ece4]">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-lg px-8 py-10 text-center text-[#6b3d33]">
        <h1 className="text-2xl font-bold mb-4">決済をキャンセルしました</h1>
        <p className="text-sm mb-4">
          決済は完了していません。もう一度ギフトを選んで支援したい場合は、
          下のボタンからギフトページに戻ってください。
        </p>
        <a
          href="/projects/test" // TODO: 実際のプロジェクトURLに差し替え
          className="inline-block mt-6 rounded-full bg-[#6b3d33] text-white px-6 py-2 text-sm font-semibold hover:bg-[#5a3029] transition"
        >
          ギフトページに戻る
        </a>
      </div>
    </main>
  );
}
