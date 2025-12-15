// app/projects/[slug]/types.ts

export type HeroSection = {
  backgroundImageUrl: string | null;
  groomNameRomaji: string | null;
  brideNameRomaji: string | null;
  weddingDate: string | null;
};

export type GreetingSection = {
  headingJa: string | null;
  titleJa: string | null;
  bodyJa: string | null;
  signedAtJa: string | null;
  signature: string | null;
};

export type PersonProfile = {
  role: "groom" | "bride";
  fullNameJa: string;
  fullNameRomaji: string | null;
  profileImageUrl: string | null;
  birthDate: string | null;
  birthPlace: string | null;
  bloodType: string | null;
  oneLiner: string | null;
};

export type HistoryItem = {
  id: string;
  role: "groom" | "bride" | "together";
  eventDate: string | null;
  title: string | null;
  description: string;
  imageUrl: string | null;
  sortOrder: number;
};

export type HistorySection = {
  headingJa: string | null;
  titleJa: string | null;
  groom: HistoryItem[];
  bride: HistoryItem[];
  together: HistoryItem[];
};

export type QaItem = {
  id: string;
  question: string;
  groomAnswer: string | null;
  brideAnswer: string | null;
  sortOrder: number;
};

export type QaSection = {
  headingJa: string | null;
  titleJa: string | null;
  groomLabel: string | null;
  brideLabel: string | null;
  groomIconUrl: string | null;
  brideIconUrl: string | null;
  items: QaItem[];
};

// 旧：1行取得用の想定型（現行DDLと一致しないため未使用）
export type SupporterLPPageRow = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export type SupporterLPPageData = {
  slug: string;
  hero: HeroSection;
  greeting: GreetingSection;
  history: HistorySection;
  qa: QaSection;
  groomProfile: PersonProfile | null;
  brideProfile: PersonProfile | null;
};

export type Project = SupporterLPPageData;
