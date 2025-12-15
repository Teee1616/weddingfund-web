"use client";

import Image from "next/image";

type WishItem = {
  id: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  targetAmount?: number | null;
  currentAmount?: number | null;
};

type Props = {
  wishItems: WishItem[];
  totalTargetAmount?: number | null;
  totalCurrentAmount: number;
};

function yen(n: number) {
  return new Intl.NumberFormat("ja-JP").format(n);
}

export default function ProjectPageClient({
  wishItems,
  totalTargetAmount,
  totalCurrentAmount,
}: Props) {
  const progress =
    totalTargetAmount && totalTargetAmount > 0
      ? Math.min(100, Math.round((totalCurrentAmount / totalTargetAmount) * 100))
      : null;

  return (
    <section className="space-y-6">
      <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
        <div className="flex items-baseline justify-between gap-4">
          <p className="text-sm text-neutral-600">現在の支援額</p>
          <p className="text-lg font-semibold">¥{yen(totalCurrentAmount)}</p>
        </div>

        {typeof progress === "number" && (
          <div className="mt-3">
            <div className="h-2 w-full rounded-full bg-neutral-200">
              <div className="h-2 rounded-full bg-neutral-900" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-1 text-xs text-neutral-600">達成率 {progress}%</p>
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {wishItems.map((item) => (
          <article key={item.id} className="rounded-2xl bg-white p-4 shadow-sm">
            {item.imageUrl ? (
              <div className="relative mb-3 aspect-[4/3] w-full overflow-hidden rounded-xl">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
              </div>
            ) : null}

            <h3 className="text-base font-semibold text-neutral-900">{item.name}</h3>
            {item.description ? <p className="mt-1 text-sm text-neutral-600">{item.description}</p> : null}

            <div className="mt-3 flex items-baseline justify-between gap-3">
              <p className="text-xs text-neutral-600">目標</p>
              <p className="text-sm font-medium">
                {typeof item.targetAmount === "number" ? `¥${yen(item.targetAmount)}` : "—"}
              </p>
            </div>
            <div className="mt-1 flex items-baseline justify-between gap-3">
              <p className="text-xs text-neutral-600">現在</p>
              <p className="text-sm font-medium">
                {typeof item.currentAmount === "number" ? `¥${yen(item.currentAmount)}` : "—"}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
