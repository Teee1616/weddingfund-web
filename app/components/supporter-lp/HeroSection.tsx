// app/projects/[slug]/_components/HeroSection.tsx
import type { HeroSection as HeroSectionData } from '@/app/projects/[slug]/types';

type Props = {
  data: HeroSectionData;
};

export function HeroSection({ data }: Props) {
  return (
    <section className="relative">
      <div
        className="relative overflow-hidden rounded-[32px] h-[360px] md:h-[420px] shadow-[0_24px_60px_rgba(120,87,66,0.35)]"
        style={{
          backgroundImage: data.backgroundImageUrl
            ? `url(${data.backgroundImageUrl})`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* シルクを少し落ち着かせるオーバーレイ */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/5 to-black/25" />

        {/* 上部メニュー */}
        <nav className="relative z-10 flex items-center justify-center pt-6 px-6">
          <ul className="flex gap-7 md:gap-10 text-[12px] md:text-sm tracking-[0.25em] text-white font-['Noto_Serif_JP']">
            <li className="cursor-pointer">MESSAGE</li>
            <li className="cursor-pointer">PROFILE</li>
            <li className="cursor-pointer">HISTORY</li>
            <li className="cursor-pointer">Q&amp;A</li>
            <li className="cursor-pointer">GALLERY</li>
            <li className="cursor-pointer">SUPPORT</li>
          </ul>
        </nav>

        {/* 中央の名前ブロック */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center pointer-events-none">
          {/* デコライン（簡易） */}
          <div className="mb-3 text-white/70 text-xs tracking-[0.4em]">
            ＊ ＊ ＊
          </div>

          <div className="flex flex-col items-center gap-1 md:gap-2 font-['Noto_Serif_JP']">
            <p className="text-[40px] md:text-[50px] leading-none text-white tracking-[0.22em] font-light">
              {data.groomNameRomaji}
            </p>
            <p className="text-[30px] md:text-[38px] leading-none text-white/90 italic -mt-1 -mb-1">
              &amp;
            </p>
            <p className="text-[40px] md:text-[50px] leading-none text-white tracking-[0.22em] font-light">
              {data.brideNameRomaji}
            </p>
          </div>

          {data.weddingDate && (
            <p className="mt-4 text-xs md:text-sm text-white/90 tracking-[0.2em]">
              {data.weddingDate}
            </p>
          )}
        </div>

        {/* 右下：応援ボタン */}
        <div className="relative z-10 absolute right-6 bottom-6 flex items-center gap-3">
          <button
            type="button"
            className="w-9 h-9 rounded-[14px] border border-white/70 bg-white/15 text-white flex items-center justify-center text-xs"
          >
            ↗
          </button>

          <button
            type="button"
            className="px-6 py-2.5 rounded-full bg-gradient-to-b from-[#f9d7b9] to-[#eeb18d] text-[13px] font-semibold text-[#6b3d33] shadow-[0_10px_22px_rgba(142,92,63,0.5)] border border-white/70"
          >
            応援する
          </button>
        </div>
      </div>
    </section>
  );
}
