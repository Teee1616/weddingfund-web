// app/projects/[slug]/page.tsx
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { ProjectPageClient } from "./ProjectPageClient";

type WishItem = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  targetAmount: number;
  currentAmount: number;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  coupleNames: string;
  message: string;
  heroImageUrl: string;
  totalTargetAmount?: number | null;
  totalCurrentAmount: number;
  supporterCount: number;
  wishItems: WishItem[];
};

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Next.js 16 では params は Promise
  const { slug } = await params;
  const slugTrimmed = slug.trim();

  // 1) カップル情報を取得
  const { data: couple, error: coupleError } = await supabaseAdmin
    .from("couple_profiles")
    .select("id, slug, partner_name, message_to_guests")
    .eq("slug", slugTrimmed)
    .maybeSingle();

  if (!couple || coupleError) {
    console.error("Failed to fetch couple profile:", coupleError);
    notFound();
  }

  // 2) 公開用ギフトリストを 1件取得
  const { data: giftList, error: giftListError } = await supabaseAdmin
    .from("gift_lists")
    .select("id, title, description, target_total")
    .eq("couple_id", couple.id)
    .eq("is_public", true)
    .order("created_at", { ascending: true })
    .maybeSingle();

  if (giftListError) {
    console.error("Failed to fetch gift list:", giftListError);
  }

  // 3) ギフトアイテム一覧を取得
  let wishItems: WishItem[] = [];
  let totalTargetAmount: number | null = null;
  let totalCurrentAmount = 0;

  if (giftList) {
    const { data: items, error: itemsError } = await supabaseAdmin
      .from("gift_items")
      .select(
        "id, name, description, image_url, target_amount, collected_amount"
      )
      .eq("gift_list_id", giftList.id)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (itemsError) {
      console.error("Failed to fetch gift items:", itemsError);
    } else if (items) {
      wishItems = items.map((item) => ({
        id: item.id,
        name: item.name ?? "",
        description: item.description ?? "",
        imageUrl: item.image_url || "/wedding-couple.jpg", // 画像未設定ならデフォルト
        targetAmount: item.target_amount ?? 0,
        currentAmount: item.collected_amount ?? 0,
      }));

      totalTargetAmount = items.reduce(
        (sum, i) => sum + (i.target_amount ?? 0),
        0
      );
      totalCurrentAmount = items.reduce(
        (sum, i) => sum + (i.collected_amount ?? 0),
        0
      );
    }
  }

  const project: Project = {
    id: couple.id,
    slug: slugTrimmed,
    title:
      giftList?.title ??
      `${couple.partner_name ?? "おふたり"} の新生活スタート応援`,
    coupleNames: couple.partner_name ?? "",
    message:
      couple.message_to_guests ??
      giftList?.description ??
      "新居での暮らしを一緒に整えていただけたら嬉しいです。",
    heroImageUrl: "/wedding-couple.jpg",
    totalTargetAmount,
    totalCurrentAmount,
    supporterCount: 0, // TODO: 支援者数は payment_sessions から集計してもよい
    wishItems,
  };

  return <ProjectPageClient project={project} />;
}
