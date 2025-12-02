// app/projects/[slug]/page.tsx
"use client";

import Image from "next/image";


type WishItem = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  targetAmount: number;
  currentAmount: number;
};

type Project = {
  title: string;
  coupleNames: string;
  message: string;
  heroImageUrl: string;
  totalTargetAmount?: number;
  totalCurrentAmount: number;
  supporterCount: number;
  wishItems: WishItem[];
};

// 仮データ（あとでDBから取得する想定）
const mockProject: Project = {
  title: "ゆうた & まりな の新生活スタート応援",
  coupleNames: "ゆうた ＆ まりな",
  message:
    "このたび私たちは入籍し、新生活をスタートしました。結婚式は挙げない代わりに、新居での暮らしを一緒に整えていただけたら嬉しいです。",
  heroImageUrl: "/wedding-couple.jpg",
  totalTargetAmount: 300000,
  totalCurrentAmount: 128000,
  supporterCount: 14,
  wishItems: [
    {
      id: "sofa",
      name: "2人がけソファ",
      description: "リビングでゆっくりくつろげる、少し良いソファ。",
      imageUrl: "/items/sofa.jpg",
      targetAmount: 80000,
      currentAmount: 52000,
    },
    {
      id: "ricecooker",
      name: "高機能炊飯器",
      description: "毎日のご飯を美味しくしてくれる相棒。",
      imageUrl: "/items/ricecooker.jpg",
      targetAmount: 40000,
      currentAmount: 12000,
    },
    {
      id: "trip",
      name: "1泊2日の温泉旅行",
      description: "新婚旅行のミニ版として、近場の温泉へ行きたいです。",
      imageUrl: "/items/trip.jpg",
      targetAmount: 100000,
      currentAmount: 64000,
    },
  ],
};

function calcProgress(current: number, target?: number) {
  if (!target || target <= 0) return 0;
  return Math.min(100, Math.round((current / target) * 100));
}

export default function ProjectPage() {
  const project = mockProject;

  const totalProgress = calcProgress(
    project.totalCurrentAmount,
    project.totalTargetAmount
  );

  return (
    <main className="min-h-screen text-[#6b3d33] font-['Noto_Serif_JP']">
      {/* 背景レイヤー（HomePageと同じ） */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/hero-fabric.jpg"
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#f4ece4]/20" />
      </div>

      {/* コンテンツ */}
      <section className="max-w-5xl mx-auto px-6 py-10 md:py-16">
        {/* 上段：タイトル＋カップル情報 */}
        <div className="bg-[#fdf9f6]/95 rounded-3xl shadow-sm px-6 md:px-10 py-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-[1.6fr,1fr] gap-6 md:gap-10 items-center">
            {/* 左：テキスト */}
            <div className="space-y-4">
              <p className="text-sm tracking-[0.15em] text-[#8b5a4a] uppercase">
                WEDDING GIFT PAGE
              </p>
              <h1 className="text-2xl md:text-3xl font-bold leading-relaxed">
                {project.title}
              </h1>
              <p className="text-sm md:text-base text-[#8b5a4a]">
                {project.coupleNames}
              </p>
              <p className="text-sm md:text-base leading-relaxed">
                {project.message}
              </p>
            </div>

            {/* 右：写真 */}
            <div className="w-full">
              <div className="w-full rounded-3xl overflow-hidden shadow-md">
                <Image
                  src={project.heroImageUrl}
                  alt={project.coupleNames}
                  width={800}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* 支援サマリ */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-white/90 rounded-2xl px-4 py-4 text-center">
              <p className="text-xs text-[#8b5a4a] mb-1">現在の支援総額</p>
              <p className="text-xl md:text-2xl font-bold">
                ¥{project.totalCurrentAmount.toLocaleString()}
              </p>
            </div>
            <div className="bg-white/90 rounded-2xl px-4 py-4 text-center">
              <p className="text-xs text-[#8b5a4a] mb-1">目標金額</p>
              <p className="text-xl md:text-2xl font-bold">
                {project.totalTargetAmount
                  ? `¥${project.totalTargetAmount.toLocaleString()}`
                  : "未設定"}
              </p>
            </div>
            <div className="bg-white/90 rounded-2xl px-4 py-4 text-center">
              <p className="text-xs text-[#8b5a4a] mb-1">支援者数</p>
              <p className="text-xl md:text-2xl font-bold">
                {project.supporterCount} 人
              </p>
            </div>
          </div>

          {/* 進捗バー */}
          {project.totalTargetAmount && (
            <div className="mt-6">
              <div className="flex justify-between text-xs text-[#8b5a4a] mb-1">
                <span>達成状況</span>
                <span>{totalProgress}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-[#e3d5c8] overflow-hidden">
                <div
                  className="h-full bg-[#c7a890] transition-all"
                  style={{ width: `${totalProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* 下段：ウィッシュリスト */}
        <div className="bg-[#fdf9f6]/95 rounded-3xl shadow-sm px-6 md:px-10 py-8">
          <h2 className="text-xl md:text-2xl font-bold mb-6 text-center">
            新生活で応援していただきたいギフト
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {project.wishItems.map((item) => {
              const progress = calcProgress(item.currentAmount, item.targetAmount);
              return (
                <div
                  key={item.id}
                  className="bg-white/90 rounded-2xl px-4 py-4 md:px-5 md:py-5 flex flex-col gap-3 shadow-sm"
                >
                  {/* 上：画像 */}
                  <div className="w-full rounded-2xl overflow-hidden shadow">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      width={600}
                      height={400}
                      className="w-full h-40 md:h-48 object-cover"
                    />
                  </div>

                  {/* 中：テキスト */}
                  <div className="space-y-1">
                    <p className="text-base md:text-lg font-semibold">
                      {item.name}
                    </p>
                    <p className="text-xs md:text-sm text-[#8b5a4a] leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* 金額＋進捗 */}
                  <div className="text-xs md:text-sm text-[#6b3d33] space-y-1">
                    <div className="flex justify-between">
                      <span>
                        現在：¥{item.currentAmount.toLocaleString()}
                      </span>
                      <span>
                        目標：¥{item.targetAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-[#e3d5c8] overflow-hidden">
                      <div
                        className="h-full bg-[#c7a890] transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-right text-[11px] text-[#8b5a4a]">
                      達成率 {progress}%
                    </p>
                  </div>

                  {/* ボタン */}
                  <button
                    // TODO: ここで Stripe Checkout のURLへ遷移 or API 呼び出し
                    onClick={() => {
                      alert(`「${item.name}」への支援フローへ進む想定`);
                    }}
                    className="mt-2 w-full rounded-full bg-[#6b3d33] text-white text-sm md:text-base font-semibold py-2.5 hover:bg-[#5a3029] transition"
                  >
                    このギフトを応援する
                  </button>
                </div>
              );
            })}
          </div>

          <p className="mt-6 text-[11px] md:text-xs text-center text-[#8b5a4a]">
            決済は Stripe を利用し、クレジットカードで安全にお支払いいただけます。
          </p>
        </div>
      </section>
    </main>
  );
}
