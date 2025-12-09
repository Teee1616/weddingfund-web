// app/projects/[slug]/_components/GreetingSection.tsx
import type { GreetingSectionData } from "../types";

type Props = {
  data: GreetingSectionData;
};

export function GreetingSection({ data }: Props) {
  if (!data.headingJa && !data.titleJa && !data.bodyJa) return null;

  return (
    <section className="bg-white/90 rounded-3xl px-6 py-8 shadow-sm">
      {data.headingJa && (
        <p className="text-xs text-[#8b5a4a] mb-2">{data.headingJa}</p>
      )}
      {data.titleJa && (
        <h2 className="text-xl font-bold mb-4">{data.titleJa}</h2>
      )}
      {data.bodyJa && (
        <p className="text-sm leading-relaxed whitespace-pre-line">
          {data.bodyJa}
        </p>
      )}

      {(data.signedAtJa || data.signature) && (
        <div className="mt-4 text-right text-xs space-y-1">
          {data.signedAtJa && <p>{data.signedAtJa}</p>}
          {data.signature && (
            <p className="font-semibold">{data.signature}</p>
          )}
        </div>
      )}
    </section>
  );
}
