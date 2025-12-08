// app/projects/[slug]/_components/HistorySection.tsx
import type { HistorySectionData } from "../types";

type Props = {
  data: HistorySectionData;
};

export function HistorySection({ data }: Props) {
  if (!data.headingJa && !data.titleJa) return null;

  return (
    <section className="bg-white/90 rounded-3xl px-6 py-8 shadow-sm">
      {data.headingJa && (
        <p className="text-xs text-[#8b5a4a] mb-2">{data.headingJa}</p>
      )}
      {data.titleJa && (
        <h2 className="text-xl font-bold mb-2">{data.titleJa}</h2>
      )}
      {/* タイムラインはあとで追加 */}
    </section>
  );
}
