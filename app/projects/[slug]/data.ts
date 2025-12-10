// app/projects/[slug]/data.ts
import { supabase } from "../../../lib/supabaseClient";

import type {
  HeroSection,
  GreetingSection,
  HistorySection as HistorySectionData,
  QaSection as QaSectionData,
  SupporterLPPageData,
  SupporterLPPageRow,
  PersonProfile,
  HistoryItem,
  QaItem,
} from "./types";

export async function getSupporterLPPageData(
  slug: string
): Promise<SupporterLPPageData | null> {
  console.log("[getSupporterLPPageData] slug:", slug);

  // ① supporter_lp_pages
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

  const coupleProfileId = row.couple_profile_id;

  // ② パートナープロフィール（新郎・新婦）
  const { data: partnerRows, error: partnersError } = await supabase
    .from("supporter_lp_partner_profiles")
    .select("*")
    .eq("couple_profile_id", coupleProfileId);

  if (partnersError) {
    console.error("[getSupporterLPPageData] partnersError:", partnersError);
    return null;
  }

  const groomRaw = partnerRows?.find((p) => p.role === "groom") ?? null;
  const brideRaw = partnerRows?.find((p) => p.role === "bride") ?? null;

  const groomProfile: PersonProfile | null = groomRaw
    ? {
        role: "groom",
        fullNameJa: groomRaw.full_name_ja,
        fullNameRomaji: groomRaw.full_name_romaji,
        profileImageUrl: groomRaw.profile_image_url,
        birthDate: groomRaw.birth_date,
        birthPlace: groomRaw.birth_place,
        bloodType: groomRaw.blood_type,
        oneLiner: groomRaw.one_liner,
      }
    : null;

  const brideProfile: PersonProfile | null = brideRaw
    ? {
        role: "bride",
        fullNameJa: brideRaw.full_name_ja,
        fullNameRomaji: brideRaw.full_name_romaji,
        profileImageUrl: brideRaw.profile_image_url,
        birthDate: brideRaw.birth_date,
        birthPlace: brideRaw.birth_place,
        bloodType: brideRaw.blood_type,
        oneLiner: brideRaw.one_liner,
      }
    : null;

  // ③ ヒストリー
  const { data: historiesRaw, error: historiesError } = await supabase
    .from("supporter_lp_histories")
    .select("*")
    .eq("couple_profile_id", coupleProfileId)
    .order("sort_order", { ascending: true });

  if (historiesError) {
    console.error("[getSupporterLPPageData] historiesError:", historiesError);
    return null;
  }

  const histories: {
    groom: HistoryItem[];
    bride: HistoryItem[];
    together: HistoryItem[];
  } = { groom: [], bride: [], together: [] };

  for (const h of historiesRaw ?? []) {
    const role = h.role as "groom" | "bride" | "together";
    const item: HistoryItem = {
      id: h.id,
      role,
      eventDate: h.event_date,
      title: h.title,
      description: h.description,
      imageUrl: h.image_url,
      sortOrder: h.sort_order,
    };

    if (role === "groom") histories.groom.push(item);
    else if (role === "bride") histories.bride.push(item);
    else histories.together.push(item);
  }

  // 上限（最大5件）だけ切っておく
  histories.groom = histories.groom.slice(0, 5);
  histories.bride = histories.bride.slice(0, 5);
  histories.together = histories.together.slice(0, 5);

  const history: HistorySectionData = {
    headingJa: row.history_heading_ja ?? null,
    titleJa: row.history_title_ja ?? null,
    groom: histories.groom,
    bride: histories.bride,
    together: histories.together,
  };

  // ④ 一問一答
  const { data: qasRaw, error: qasError } = await supabase
    .from("supporter_lp_questions")
    .select("*")
    .eq("couple_profile_id", coupleProfileId)
    .order("sort_order", { ascending: true });

  if (qasError) {
    console.error("[getSupporterLPPageData] qasError:", qasError);
    return null;
  }

  const qaItems: QaItem[] = (qasRaw ?? []).slice(0, 7).map((q) => ({
    id: q.id,
    question: q.question,
    groomAnswer: q.groom_answer,
    brideAnswer: q.bride_answer,
    sortOrder: q.sort_order,
  }));

  const qa: QaSectionData = {
    headingJa: row.qa_heading_ja ?? null,
    titleJa: row.qa_title_ja ?? null,
    groomLabel: row.qa_groom_label ?? null,
    brideLabel: row.qa_bride_label ?? null,
    groomIconUrl: row.qa_groom_icon_url ?? null,
    brideIconUrl: row.qa_bride_icon_url ?? null,
    items: qaItems,
  };

  const result: SupporterLPPageData = {
    slug: row.slug,
    hero,
    greeting,
    history,
    qa,
    groomProfile,
    brideProfile,
  };

  return result;
}
