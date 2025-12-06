// app/projects/[slug]/ProjectPageClient.tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import type { Project } from "./page";

type WishItem = Project["wishItems"][number];

function calcProgress(current: number, target?: number | null) {
  if (!target || target <= 0) return 0;
  return Math.min(100, Math.round((current / target) * 100));
}

export function ProjectPageClient({ project }: { project: Project }) {
  const totalProgress = calcProgress(
    project.totalCurrentAmount,
    project.totalTargetAmount ?? undefined
  );

  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);

  const handleSupport = async (item: WishItem) => {
    try {
      setLoadingItemId(item.id);

      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          giftItemId: item.id,
          amount: item.targetAmount,
        }),
      });

      if (!res.ok) {
        console.error("Failed to create checkout session");
        return;
      }

      const data = await res.json();

      if (data?.url) {
        window.location.href = data.url;
      } else {
        console.error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Error while creating checkout session:", error);
    } finally {
      setLoadingItemId(null);
    }
  };

  return (
    <main className="min-h-screen text-[#6b3d33] font-['Noto_Serif_JP']">
      {/* 背景 */}
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

      <section className="max-w-5xl mx-auto px-6 py-10 md:py-16">
        {/* 上段：タイトル＋カップル情報 */}
        <div className="bg-[#fdf9f6]/95 rounded-3xl shadow-sm px-6 md:px-10 py-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-[1.6fr,1fr] gap-6 md:gap-10 items-center">
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

          {/* サマリ */}
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

        {/* 下段：ギフトリスト */}
        <div className="bg-[#fdf9f6]/95 rounded-3xl shadow-sm px-6 md:px-10 py-8">
          <h2 className="text-xl md:text-2xl font-bold mb-6 text-center">
            新生活で応援していただきたいギフト
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {project.wishItems.map((item) => {
              const progress = calcProgress(
                item.currentAmount,
                item.targetAmount
              );
              const isLoading = loadingItemId === item.id;

              return (
                <div
                  key={item.id}
                  className="bg-white/90 rounded-2xl px-4 py-4 md:px-5 md:py-5 flex flex-col gap-3 shadow-sm"
                >
                  <div className="w-full rounded-2xl overflow-hidden shadow">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      width={600}
                      height={400}
                      className="w-full h-40 md:h-48 object-cover"
                    />
                  </div>

                  <div className="space-y-1">
                    <p className="text-base md:text-lg font-semibold">
                      {item.name}
                    </p>
                    <p className="text-xs md:text-sm text-[#8b5a4a] leading-relaxed">
                      {item.description}
                    </p>
                  </div>

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

                  <button
                    onClick={() => handleSupport(item)}
                    disabled={isLoading}
                    className="mt-2 w-full rounded-full bg-[#6b3d33] text-white text-sm md:text-base font-semibold py-2.5 hover:bg-[#5a3029] transition disabled:opacity-60"
                  >
                    {isLoading
                      ? "処理中..."
                      : `このギフトを応援する（¥${item.targetAmount.toLocaleString()}）`}
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
