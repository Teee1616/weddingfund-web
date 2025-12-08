// app/projects/[slug]/types.ts

// ヒーローセクション
export type HeroSection = {
  backgroundImageUrl?: string;
  groomNameRomaji: string;
  brideNameRomaji: string;
  weddingDate?: string;
};

// ごあいさつ
export type GreetingSection = {
  headingJa?: string | null;
  titleJa?: string | null;
  bodyJa?: string | null;
  signedAtJa?: string | null;
  signature?: string | null;
};

// 歴史
export type HistorySection = {
  headingJa?: string | null;
  titleJa?: string | null;
};

// Q&A
export type QaSection = {
  headingJa?: string | null;
  titleJa?: string | null;
  groomLabel?: string | null;
  brideLabel?: string | null;
  groomIconUrl?: string | null;
  brideIconUrl?: string | null;
};

// ページ全体
export type SupporterLPPageData = {
  slug: string;
  hero: HeroSection;
  greeting: GreetingSection;
  history: HistorySection;
  qa: QaSection;
};
