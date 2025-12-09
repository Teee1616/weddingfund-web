// app/projects/[slug]/_components/HistorySection.tsx
import type {
  HistorySection as HistorySectionData,
  HistoryItem,
} from "../types";

type Props = {
  data: HistorySectionData;
};

// ★ named export（export function ...）にすること！
export function HistorySection({ data }: Props) {
  // 万一 undefined でも空配列として扱う
  const groomItems: HistoryItem[] = data.groom ?? [];
  const brideItems: HistoryItem[] = data.bride ?? [];
  const togetherItems: HistoryItem[] = data.together ?? [];

  const hasAny =
    groomItems.length || brideItems.length || togetherItems.length;

  if (!hasAny && !data.headingJa && !data.titleJa) return null;

  return (
    <section className="bg-white rounded-3xl shadow-sm px-8 py-10 space-y-8">
      <header className="space-y-1 text-center">
        <p className="text-xs tracking-[0.2em] text-neutral-500">
          {data.headingJa || "HISTORY"}
        </p>
        <h2 className="text-lg font-semibold text-[#7b4a3a]">
          {data.titleJa || "新郎新婦のヒストリー"}
        </h2>
      </header>

      {/* 上段：新郎 / 新婦 タイムライン */}
      <div className="grid md:grid-cols-[1fr_auto_1fr] gap-6 md:gap-10">
        <TimelineColumn
          label="YUDAI'S STORY"
          items={groomItems}
          align="right"
        />

        <div className="hidden md:flex flex-col items-center">
          <div className="w-px flex-1 bg-neutral-300" />
        </div>

        <TimelineColumn
          label="NATSU'S STORY"
          items={brideItems}
          align="left"
        />
      </div>

      {/* 下段：二人のヒストリー */}
      {togetherItems.length > 0 && (
        <div className="mt-8 space-y-4">
          {togetherItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col md:flex-row md:items-center gap-4 bg-[#f7efe7] rounded-2xl px-5 py-4"
            >
              <HistoryImage item={item} />

              <div className="flex-1 text-sm space-y-1">
                {item.eventDate && (
                  <p className="text-xs text-neutral-600">{item.eventDate}</p>
                )}
                {item.title && (
                  <p className="font-semibold text-[#7b4a3a]">
                    {item.title}
                  </p>
                )}
                <p className="text-neutral-800 whitespace-pre-line">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

type TimelineColumnProps = {
  label: string;
  items: HistoryItem[];
  align: "left" | "right";
};

function TimelineColumn({ label, items, align }: TimelineColumnProps) {
  if (!items.length) return <div />;

  return (
    <div
      className={
        align === "right"
          ? "md:text-right space-y-6"
          : "md:text-left space-y-6"
      }
    >
      <p className="text-[11px] tracking-[0.25em] text-neutral-500 uppercase">
        {label}
      </p>
      {items.map((item) => (
        <div key={item.id} className="space-y-2">
          <HistoryImage item={item} />
          {item.eventDate && (
            <p className="text-xs text-neutral-600">{item.eventDate}</p>
          )}
          {item.title && (
            <p className="text-sm font-semibold text-[#7b4a3a]">
              {item.title}
            </p>
          )}
          <p className="text-sm text-neutral-800 whitespace-pre-line">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  );
}

function HistoryImage({ item }: { item: HistoryItem }) {
  return (
    <div className="w-full h-28 rounded-xl bg-[#e7f3fb] overflow-hidden">
      {item.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.imageUrl}
          alt={item.title ?? ""}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-xs text-neutral-400">
          PHOTO
        </div>
      )}
    </div>
  );
}
