// app/projects/[slug]/page.tsx
import { HeroSection } from "./_components/HeroSection";
import { GreetingSection } from "./_components/GreetingSection";
import { HistorySection } from "./_components/HistorySection";
import { QaSection } from "./_components/QaSection";
import { getSupporterLPPageData } from "./data";
import type { SupporterLPPageData } from "./types";

type PageParams = {
  slug: string;
};

type PageProps = {
  // ⚠ Next.js 16 では params は Promise になっている
  params: Promise<PageParams>;
};

export default async function ProjectPage({ params }: PageProps) {
  // 🔴 ここで `await params` してから slug を取り出す
  const { slug } = await params;

  console.log("[ProjectPage] slug:", slug);

  const pageData: SupporterLPPageData | null =
    await getSupporterLPPageData(slug);

  if (!pageData) {
    return <div>ページが存在しません。</div>;
  }

  return (
    <main className="min-h-screen bg-[#f4ece4] text-[#6b3d33] font-['Noto_Serif_JP']">
      <section className="max-w-5xl mx-auto px-6 py-10 md:px-10 md:py-16 space-y-10">
        <HeroSection data={pageData.hero} />
        <GreetingSection data={pageData.greeting} />
        <HistorySection data={pageData.history} />
        <QaSection data={pageData.qa} />
      </section>
    </main>
  );
}
