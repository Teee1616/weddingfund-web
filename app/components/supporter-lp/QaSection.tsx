// components/supporter-lp/QaSection.tsx
import Image from 'next/image';
import type { QaSection as QaSectionData } from '@/app/projects/[slug]/types';

type Props = {
  data: QaSectionData;
};

export function QaSection({ data }: Props) {
  const items = data.items ?? [];

  if (!items.length && !data.headingJa && !data.titleJa) return null;

  return (
    <section className="bg-white rounded-3xl shadow-sm px-8 py-10 space-y-8">
      <header className="space-y-1 text-center">
        <p className="text-xs tracking-[0.2em] text-neutral-500">
          {data.headingJa || 'QUESTION'}
        </p>
        <h2 className="text-lg font-semibold text-[#7b4a3a]">
          {data.titleJa || '一問一答'}
        </h2>
      </header>

      <div className="border border-[#d8c3b3] rounded-2xl px-6 py-6 space-y-4">
        {/* 見出し行：アイコン＋名前 */}
        <div className="grid grid-cols-[1.5fr,1fr,1fr] text-xs font-medium text-neutral-600 items-center">
          <div />
          <div className="flex flex-col items-center gap-1">
            <CircleIcon src={data.groomIconUrl} />
            <span>{data.groomLabel || ''}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <CircleIcon src={data.brideIconUrl} />
            <span>{data.brideLabel || ''}</span>
          </div>
        </div>

        <div className="h-px bg-[#d8c3b3]" />

        {/* Q&A 本体 */}
        <div className="space-y-3 text-xs md:text-sm">
          {items.map((qa) => (
            <div
              key={qa.id}
              className="grid grid-cols-[1.5fr,1fr,1fr] gap-4 items-start"
            >
              <p className="font-medium text-neutral-800">{qa.question}</p>
              <p className="text-neutral-800 whitespace-pre-line">
                {qa.groomAnswer}
              </p>
              <p className="text-neutral-800 whitespace-pre-line">
                {qa.brideAnswer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CircleIcon({ src }: { src?: string | null }) {
  return (
    <div className="w-10 h-10 rounded-full bg-[#e7f3fb] overflow-hidden flex items-center justify-center">
      {src ? (
        <Image
          src={src}
          alt=""
          width={40}
          height={40}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-[10px] text-neutral-400">IMG</span>
      )}
    </div>
  );
}
