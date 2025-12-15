import { supabase } from "@/lib/supabaseClient";
import type { SupporterLPPageData, PersonProfile, HistoryItem, QaItem } from "./types";

export async function getSupporterLPPageData(
  slug: string,
  opts?: { preview?: boolean },
): Promise<SupporterLPPageData | null> {
  const preview = opts?.preview ?? false;

  try {
    // 1) slug -> couple
    const { data: couple, error: coupleErr } = await supabase
      .from("couple_profiles")
      .select("*")
      .eq("slug", slug)
      .single();

    if (coupleErr || !couple) {
      console.error("[getSupporterLPPageData] couple not found:", coupleErr);
      return null;
    }

    // 2) couple -> gift_list（※理想は couple_id UNIQUE で 1件保証）
    const { data: giftList, error: glErr } = await supabase
      .from("gift_lists")
      .select("*")
      .eq("couple_id", couple.id)
      .single();

    if (glErr || !giftList) {
      console.error("[getSupporterLPPageData] gift_list not found:", glErr);
      return null;
    }

    // 3) 公開判定（previewなら無視）
    if (!preview && giftList.is_public !== true) {
      console.warn("[getSupporterLPPageData] not public");
      return null;
    }

    // 4) 子テーブル取得（gift_list_id）
    const [itemsRes, historiesRes, qaRes, photosRes] = await Promise.all([
      supabase
        .from("gift_items")
        .select("*")
        .eq("gift_list_id", giftList.id)
        .order("sort_order", { ascending: true }),
      supabase
        .from("histories")
        .select("*")
        .eq("gift_list_id", giftList.id)
        .order("sort_order", { ascending: true }),
      supabase
        .from("couple_qa")
        .select("*")
        .eq("gift_list_id", giftList.id)
        .order("sort_order", { ascending: true }),
      supabase
        .from("couple_photos")
        .select("*")
        .eq("gift_list_id", giftList.id)
        .order("sort_order", { ascending: true }),
    ]);

    // person_profiles は存在しない環境もあり得るので「失敗しても落とさない」
    const { data: personProfiles, error: personsErr } = await supabase
      .from("person_profiles")
      .select("*")
      .eq("gift_list_id", giftList.id);

    if (itemsRes.error) console.error("[getSupporterLPPageData] gift_items error:", itemsRes.error);
    if (historiesRes.error) console.error("[getSupporterLPPageData] histories error:", historiesRes.error);
    if (qaRes.error) console.error("[getSupporterLPPageData] couple_qa error:", qaRes.error);
    if (photosRes.error) console.error("[getSupporterLPPageData] couple_photos error:", photosRes.error);
    if (personsErr) console.error("[getSupporterLPPageData] person_profiles error:", personsErr);

    // itemsRes は今は Layout 側が使ってない前提なので、エラーでも落とさないなら外せる。
    if (historiesRes.error || qaRes.error || photosRes.error) return null;

    // --- 画面用に整形 ---
    // 現行DDLでは hero_*/greeting_* 等のカラムは gift_lists に存在しないため、
    // まずは「DBにある情報だけ」で埋める（UI拡張は後で）
    const hero = {
      backgroundImageUrl: null,
      groomNameRomaji: null,
      brideNameRomaji: null,
      weddingDate: couple.wedding_date ? String(couple.wedding_date) : null,
    };

    const greeting = {
      headingJa: null,
      titleJa: giftList.title ?? null,
      bodyJa: giftList.greeting_message ?? giftList.description ?? null,
      signedAtJa: null,
      signature: null,
    };

    const histories: HistoryItem[] = (historiesRes.data ?? []).map((h: any) => ({
      id: h.id,
      role: h.role ?? "together",
      eventDate: h.event_date ?? null,
      title: h.title ?? null,
      description: h.description ?? "",
      imageUrl: h.image_url ?? null,
      sortOrder: typeof h.sort_order === "number" ? h.sort_order : 0,
    }));

    const historySection = {
      headingJa: null,
      titleJa: null,
      groom: histories.filter((x) => x.role === "groom"),
      bride: histories.filter((x) => x.role === "bride"),
      together: histories.filter((x) => x.role === "together"),
    };

    const qaItems: QaItem[] = (qaRes.data ?? []).map((q: any) => ({
      id: q.id,
      question: q.question ?? "",
      groomAnswer: q.groom_answer ?? null,
      brideAnswer: q.bride_answer ?? null,
      sortOrder: typeof q.sort_order === "number" ? q.sort_order : 0,
    }));

    const qaSection = {
      headingJa: null,
      titleJa: null,
      groomLabel: null,
      brideLabel: null,
      groomIconUrl: null,
      brideIconUrl: null,
      items: qaItems,
    };

    const persons = (personProfiles ?? []) as any[];
    const groomProfile: PersonProfile | null = persons.length
      ? (persons.find((p) => p.role === "groom") as any)
      : null;
    const brideProfile: PersonProfile | null = persons.length
      ? (persons.find((p) => p.role === "bride") as any)
      : null;

    const pageData: SupporterLPPageData = {
      // slug は couple_profiles.slug が正
      slug: (couple.slug as string) ?? slug,
      hero,
      greeting,
      history: historySection,
      qa: qaSection,
      groomProfile,
      brideProfile,
    };

    return pageData;
  } catch (e) {
    console.error("[getSupporterLPPageData] unexpected error:", e);
    return null;
  }
}
