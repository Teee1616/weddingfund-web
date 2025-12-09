// app/projects/[slug]/page.tsx

// ここを修正
import { SupporterLPLayout } from '@/app/components/supporter-lp/Layout';
import { getSupporterLPPageData } from './data';
import type { SupporterLPPageData } from './types';


type PageParams = {
  slug: string;
};

type PageProps = {
  // Next.js 16 では params が Promise になる
  params: Promise<PageParams>;
};

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;

  const pageData: SupporterLPPageData | null =
    await getSupporterLPPageData(slug);

  if (!pageData) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#f5f2ec]">
        <p className="text-sm text-neutral-600">ページが存在しません。</p>
      </main>
    );
  }

  // ここで共通レイアウトに丸投げ
  return <SupporterLPLayout pageData={pageData} />;
}
