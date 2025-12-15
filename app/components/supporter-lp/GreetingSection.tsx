// app/projects/[slug]/_components/GreetingSection.tsx
import type { GreetingSection as GreetingSectionData } from '@/app/projects/[slug]/types';


type Props = {
  data: GreetingSectionData;
};

export function GreetingSection({ data }: Props) {
  if (!data.headingJa && !data.titleJa && !data.bodyJa) return null;

  return (
    <section className="bg-white/97 rounded-[26px] px-7 py-8 md:px-10 md:py-9 shadow-[0_18px_40px_rgba(144,110,86,0.2)] border border-[#f2dfcf]">
      <div className="flex flex-col gap-5 md:gap-0 md:flex-row md:items-start md:justify-between">
        {/* 左側：テキスト */}
        <div className="md:w-3/4">
          {data.headingJa && (
            <p className="text-xs text-[#b07a5b] mb-1 tracking-[0.3em]">
              {data.headingJa}
            </p>
          )}
          {data.titleJa && (
            <h2 className="text-lg md:text-xl font-semibold tracking-[0.16em] text-[#6b3d33] mb-4">
              {data.titleJa}
            </h2>
          )}
          {data.bodyJa && (
            <p className="text-sm md:text-[15px] leading-relaxed md:leading-8 text-[#5a342b] whitespace-pre-line">
              {data.bodyJa}
            </p>
          )}
        </div>

        {/* 右下：日付＋署名 */}
        {(data.signedAtJa || data.signature) && (
          <div className="md:w-1/4 md:text-right text-xs text-[#8c5d45] mt-2 md:mt-0 space-y-1">
            {data.signedAtJa && (
              <p className="tracking-[0.12em]">{data.signedAtJa}</p>
            )}
            {data.signature && (
              <p className="mt-1 inline-block px-3 py-1 rounded-full bg-[#f9efe6] border border-[#e5cdb8] text-[11px] tracking-[0.18em]">
                {data.signature}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
