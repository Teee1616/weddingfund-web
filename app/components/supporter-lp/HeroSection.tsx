// app/projects/[slug]/_components/HeroSection.tsx
import type { HeroSectionData } from "../types";

type Props = {
  data: HeroSectionData;
};

export function HeroSection({ data }: Props) {
  return (
    <section
      className="w-full text-[#6b3d33] font-['Noto_Serif_JP']"
      style={{
        backgroundImage: data.backgroundImageUrl
          ? `url(${data.backgroundImageUrl})`
          : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-white/80 rounded-3xl px-6 py-8 md:px-10 md:py-10 shadow-sm">
        <p className="text-sm tracking-[0.2em] text-[#8b5a4a] mb-3">
          WEDDING GIFT PAGE
        </p>
        <h1 className="text-4xl font-light tracking-wide">
          {data.groomNameRomaji} ＆ {data.brideNameRomaji}
        </h1>
        {data.weddingDate && (
          <p className="text-sm text-[#8b5a4a] mt-2">{data.weddingDate}</p>
        )}
      </div>
    </section>
  );
}
