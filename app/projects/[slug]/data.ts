// app/projects/[slug]/data.ts
// app/projects/[slug]/data.ts
import { supabase } from "../../../lib/supabaseClient";  // ← lib を挟む

import type {
  HeroSection,
  GreetingSection,
  HistorySection,
  QaSection,
  SupporterLPPageData,
  SupporterLPPageRow,
} from "./types";

export async function getSupporterLPPageData(
  slug: string
): Promise<SupporterLPPageData | null> {
  console.log("[getSupporterLPPageData] slug:", slug);

  const { data: row, error } = await supabase
    .from("supporter_lp_pages")
    .select("*")
    .eq("slug", slug)
    .maybeSingle<SupporterLPPageRow>();

  if (error) {
    console.error("[getSupporterLPPageData] error:", error);
    return null;
  }
  if (!row) {
    console.warn("[getSupporterLPPageData] not found:", slug);
    return null;
  }

  const hero: HeroSection = {
    backgroundImageUrl: row.hero_background_image_url ?? null,
    groomNameRomaji: row.hero_groom_name_romaji ?? null,
    brideNameRomaji: row.hero_bride_name_romaji ?? null,
    weddingDate: row.wedding_date ?? null,
  };

  const greeting: GreetingSection = {
    headingJa: row.greeting_heading_ja ?? null,
    titleJa: row.greeting_title_ja ?? null,
    bodyJa: row.greeting_body_ja ?? null,
    signedAtJa: row.greeting_signed_at ?? null,
    signature: row.greeting_signature ?? null,
  };

  const history: HistorySection = {
    headingJa: row.history_heading_ja ?? null,
    titleJa: row.history_title_ja ?? null,
  };

  const qa: QaSection = {
    headingJa: row.qa_heading_ja ?? null,
    titleJa: row.qa_title_ja ?? null,
    groomLabel: row.qa_groom_label ?? null,
    brideLabel: row.qa_bride_label ?? null,
    groomIconUrl: row.qa_groom_icon_url ?? null,
    brideIconUrl: row.qa_bride_icon_url ?? null,
  };

  const result: SupporterLPPageData = {
    slug: row.slug,
    hero,
    greeting,
    history,
    qa,
  };

  return result;
}
