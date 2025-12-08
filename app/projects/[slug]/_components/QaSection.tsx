// app/projects/[slug]/_components/QaSection.tsx
import Image from "next/image";
import type { QaSection as QaSectionData } from "../types";

type Props = {
  data: QaSectionData;
};

export function QaSection({ data }: Props) {
  if (!data.headingJa && !data.titleJa) return null;

  return (
    <section className="bg-white/90 rounded-3xl px-6 py-8 shadow-sm">
      {data.headingJa && (
        <p className="text-xs text-[#8b5a4a] mb-2">{data.headingJa}</p>
      )}
      {data.titleJa && (
        <h2 className="text-xl font-bold mb-4">{data.titleJa}</h2>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center gap-3">
          {data.groomIconUrl && (
            <div className="w-12 h-12 rounded-full overflow-hidden bg-[#f4ece4]">
              <Image
                src={data.groomIconUrl}
                alt={data.groomLabel ?? "groom"}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          {data.groomLabel && (
            <p className="text-sm font-semibold">{data.groomLabel}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {data.brideIconUrl && (
            <div className="w-12 h-12 rounded-full overflow-hidden bg-[#f4ece4]">
              <Image
                src={data.brideIconUrl}
                alt={data.brideLabel ?? "bride"}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          {data.brideLabel && (
            <p className="text-sm font-semibold">{data.brideLabel}</p>
          )}
        </div>
      </div>
    </section>
  );
}
