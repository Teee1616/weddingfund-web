"use client";

import { useEffect, useState, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type GiftList = {
  id: string;
  couple_id: string;
  title: string | null;
  description: string | null;
  greeting_message: string | null;
  template_key: string | null;
};

type CoupleProfile = {
  id: string;
  partner_name: string | null;
  partner_email: string | null;
  wedding_status: string | null;
  wedding_date: string | null; // date を一旦 string として扱う
  message_to_guests: string | null;
};

type GiftItem = {
  id: string;
  name: string | null;
  target_amount: number | null;
  sort_order?: number | null; // ★追加（並び順のため）
};

export default function ProjectEditPage() {
  const router = useRouter();
  const params = useParams();
  const giftListId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [savingBasic, setSavingBasic] = useState(false);
  const [savingCouple, setSavingCouple] = useState(false);
  const [addingItem, setAddingItem] = useState(false);

  const [giftList, setGiftList] = useState<GiftList | null>(null);
  const [couple, setCouple] = useState<CoupleProfile | null>(null);
  const [giftItems, setGiftItems] = useState<GiftItem[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 新規アイテム用
  const [newItemName, setNewItemName] = useState("");
  const [newItemAmount, setNewItemAmount] = useState<number | "">("");

  // ★ gift_items を必ずDBから再取得する（入り直しでも同じ状態になる）
  const reloadItems = async (listId: string) => {
    const { data: itemsData, error: itemsError } = await supabase
      .from("gift_items")
      .select("id, name, target_amount, sort_order")
      .eq("gift_list_id", listId)
      .order("sort_order", { ascending: true });

    if (itemsError) {
      console.error(itemsError);
      setErrorMsg("ほしいものリストの取得に失敗しました。");
      return;
    }

    setGiftItems((itemsData ?? []) as GiftItem[]);
  };

  useEffect(() => {
  const load = async () => {
    if (!giftListId) return;
    setLoading(true);
    setErrorMsg(null);

    // 1) gift_lists を「id優先」で探す。無ければ couple_id で探す
    let giftListRow: GiftList | null = null;

    // (a) id = [id]
    const byId = await supabase
      .from("gift_lists")
      .select("id, couple_id, title, description, greeting_message, template_key")
      .eq("id", giftListId)
      .maybeSingle();

    if (byId.error) {
      console.error("[load] gift_lists by id error:", byId.error);
    }

    if (byId.data) {
      giftListRow = byId.data as GiftList;
    } else {
      // (b) couple_id = [id]
      const byCouple = await supabase
        .from("gift_lists")
        .select("id, couple_id, title, description, greeting_message, template_key")
        .eq("couple_id", giftListId)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (byCouple.error) {
        console.error("[load] gift_lists by couple_id error:", byCouple.error);
      }

      if (byCouple.data) {
        giftListRow = byCouple.data as GiftList;
      }
    }

    if (!giftListRow) {
      setErrorMsg("ご祝儀ページ（gift_lists）が見つかりません。");
      setLoading(false);
      return;
    }

    setGiftList(giftListRow);

    // 2) couple_profiles（gift_lists.couple_id から取得）
    const { data: coupleData, error: coupleError } = await supabase
      .from("couple_profiles")
      .select("id, partner_name, partner_email, wedding_status, wedding_date, message_to_guests")
      .eq("id", giftListRow.couple_id)
      .maybeSingle();

    if (coupleError || !coupleData) {
      console.error("[load] couple_profiles error:", coupleError);
      setErrorMsg("カップルプロフィールが見つかりません。");
      setLoading(false);
      return;
    }

    setCouple(coupleData as CoupleProfile);

    // 3) gift_items（gift_list_id で取得）
    await reloadItems(giftListRow.id);

    setLoading(false);
  };

  load();
}, [giftListId]);


  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#f5f2ec]">
        <p className="text-sm text-slate-600">読み込み中…</p>
      </main>
    );
  }

  if (errorMsg || !giftList || !couple) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#f5f2ec]">
        <div className="bg-white shadow-md rounded-xl p-6 max-w-md w-full">
          <p className="text-sm text-red-600 whitespace-pre-line">
            {errorMsg ?? "データの取得に失敗しました。"}
          </p>

          {/* ★ダッシュボードへ戻る */}
          <button
            className="mt-4 w-full px-4 py-2 border rounded-full text-xs bg-white"
            onClick={() => router.push("/dashboard")}
            type="button"
          >
            ダッシュボードへ戻る
          </button>
        </div>
      </main>
    );
  }

  // --- 基本情報（gift_lists）の保存 ---
  const handleSaveBasic = async (e: FormEvent) => {
    e.preventDefault();
    setSavingBasic(true);

    const { error } = await supabase
      .from("gift_lists")
      .update({
        title: giftList.title,
        description: giftList.description,
        greeting_message: giftList.greeting_message,
        template_key: giftList.template_key ?? "template1",
        updated_at: new Date().toISOString(), // ★最新化
      })
      .eq("id", giftList.id);

    setSavingBasic(false);

    if (error) {
      console.error(error);
      alert("基本情報の保存に失敗しました。");
      return;
    }
    alert("基本情報を保存しました。");
  };

  // --- カップル情報（couple_profiles）の保存 ---
  const handleSaveCouple = async (e: FormEvent) => {
    e.preventDefault();
    setSavingCouple(true);

    const { error } = await supabase
      .from("couple_profiles")
      .update({
        partner_name: couple.partner_name,
        partner_email: couple.partner_email,
        wedding_status: couple.wedding_status,
        wedding_date: couple.wedding_date,
        message_to_guests: couple.message_to_guests,
      })
      .eq("id", couple.id);

    setSavingCouple(false);

    if (error) {
      console.error(error);
      alert("カップル情報の保存に失敗しました。");
      return;
    }
    alert("カップル情報を保存しました。");
  };

  // --- ほしいものリスト追加 ---
  const handleAddItem = async (e: FormEvent) => {
    e.preventDefault();
    if (!newItemName || newItemAmount === "") return;

    setAddingItem(true);

    // ★sort_order を確実に付ける（これが無いと並び＆取得が不安定になりやすい）
    const lastOrder = Math.max(
      0,
      ...giftItems.map((x) => (typeof x.sort_order === "number" ? x.sort_order : 0))
    );
    const nextOrder = lastOrder + 1;

    const { error } = await supabase.from("gift_items").insert({
      gift_list_id: giftList.id,
      name: newItemName,
      target_amount: newItemAmount,
      sort_order: nextOrder,
      collected_amount: 0, // ※DBで必須なら必要。不要なら削除OK
      updated_at: new Date().toISOString(),
    });

    setAddingItem(false);

    if (error) {
      console.error(error);
      alert("アイテムの追加に失敗しました。");
      return;
    }

    // ★insert後は必ず再取得（これで入り直しても消えない＝DBが真実になる）
    await reloadItems(giftList.id);

    setNewItemName("");
    setNewItemAmount("");
  };

  // --- アイテム削除（MVP用に簡易） ---
  const handleDeleteItem = async (id: string) => {
    if (!confirm("このアイテムを削除しますか？")) return;

    const { error } = await supabase.from("gift_items").delete().eq("id", id);

    if (error) {
      console.error(error);
      alert("削除に失敗しました。");
      return;
    }

    // ★削除後も再取得
    await reloadItems(giftList.id);
  };

  return (
    <main className="min-h-screen bg-[#f5f2ec]">
      <div className="max-w-5xl mx-auto py-8 px-4 space-y-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">ご祝儀ページ編集</h1>
            <p className="text-xs text-slate-600">
              タイトル・挨拶文・お二人の情報・ほしいものリストを編集できます。
            </p>
          </div>

          {/* ★ダッシュボードへ戻る */}
          <button
            className="px-4 py-2 border rounded-full text-xs bg-white"
            onClick={() => router.push("/dashboard")}
            type="button"
          >
            ダッシュボードへ戻る
          </button>
        </div>

        {/* 基本情報（gift_lists） */}
        <section className="bg-white rounded-2xl shadow-md p-6 space-y-4">
          <h2 className="text-lg font-semibold mb-2">基本情報</h2>

          <form onSubmit={handleSaveBasic} className="space-y-4 text-sm">
            <div>
              <label className="block text-xs mb-1">ページタイトル</label>
              <input
                className="w-full border rounded-md px-3 py-2 text-sm"
                value={giftList.title ?? ""}
                onChange={(e) =>
                  setGiftList((prev) => (prev ? { ...prev, title: e.target.value } : prev))
                }
              />
            </div>

            <div>
              <label className="block text-xs mb-1">ページ説明文</label>
              <textarea
                className="w-full border rounded-md px-3 py-2 text-sm"
                rows={3}
                value={giftList.description ?? ""}
                onChange={(e) =>
                  setGiftList((prev) => (prev ? { ...prev, description: e.target.value } : prev))
                }
              />
            </div>

            <div>
              <label className="block text-xs mb-1">ゲストへの挨拶文</label>
              <textarea
                className="w-full border rounded-md px-3 py-2 text-sm"
                rows={5}
                value={giftList.greeting_message ?? ""}
                onChange={(e) =>
                  setGiftList((prev) =>
                    prev ? { ...prev, greeting_message: e.target.value } : prev
                  )
                }
              />
            </div>

            <div>
              <label className="block text-xs mb-1">テンプレート</label>
              <select
                className="border rounded-md px-3 py-2 text-sm"
                value={giftList.template_key ?? "template1"}
                onChange={(e) =>
                  setGiftList((prev) => (prev ? { ...prev, template_key: e.target.value } : prev))
                }
              >
                <option value="template1">シンプル</option>
                <option value="template2">華やか</option>
              </select>
            </div>

            <button
              type="submit"
              className="px-4 py-2 border rounded-full text-xs bg-black text-white disabled:opacity-60"
              disabled={savingBasic}
            >
              {savingBasic ? "保存中…" : "基本情報を保存"}
            </button>
          </form>
        </section>

        {/* カップル情報（couple_profiles） */}
        <section className="bg-white rounded-2xl shadow-md p-6 space-y-4">
          <h2 className="text-lg font-semibold mb-2">お二人の情報</h2>

          <form onSubmit={handleSaveCouple} className="space-y-4 text-sm">
            <div>
              <label className="block text-xs mb-1">お名前（表示用）</label>
              <input
                className="w-full border rounded-md px-3 py-2 text-sm"
                value={couple.partner_name ?? ""}
                onChange={(e) =>
                  setCouple((prev) => (prev ? { ...prev, partner_name: e.target.value } : prev))
                }
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-xs mb-1">結婚ステータス</label>
                <input
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  placeholder="入籍のみ / フォトウェディング など"
                  value={couple.wedding_status ?? ""}
                  onChange={(e) =>
                    setCouple((prev) => (prev ? { ...prev, wedding_status: e.target.value } : prev))
                  }
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs mb-1">記念日</label>
                <input
                  type="date"
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  value={couple.wedding_date ?? ""}
                  onChange={(e) =>
                    setCouple((prev) => (prev ? { ...prev, wedding_date: e.target.value } : prev))
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-xs mb-1">補足メッセージ（任意）</label>
              <textarea
                className="w-full border rounded-md px-3 py-2 text-sm"
                rows={3}
                value={couple.message_to_guests ?? ""}
                onChange={(e) =>
                  setCouple((prev) =>
                    prev ? { ...prev, message_to_guests: e.target.value } : prev
                  )
                }
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2 border rounded-full text-xs bg-black text-white disabled:opacity-60"
              disabled={savingCouple}
            >
              {savingCouple ? "保存中…" : "お二人の情報を保存"}
            </button>
          </form>
        </section>

        {/* ほしいものリスト（gift_items） */}
        <section className="bg-white rounded-2xl shadow-md p-6 space-y-4">
          <h2 className="text-lg font-semibold mb-2">ほしいものリスト</h2>

          <form onSubmit={handleAddItem} className="flex flex-wrap gap-3 items-end text-sm">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs mb-1">アイテム名</label>
              <input
                className="w-full border rounded-md px-3 py-2 text-sm"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs mb-1">目標金額（円）</label>
              <input
                type="number"
                className="w-32 border rounded-md px-3 py-2 text-sm"
                value={newItemAmount}
                onChange={(e) =>
                  setNewItemAmount(e.target.value === "" ? "" : Number(e.target.value))
                }
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 border rounded-full text-xs bg-white disabled:opacity-60"
              disabled={addingItem}
            >
              {addingItem ? "追加中…" : "アイテムを追加"}
            </button>
          </form>

          <ul className="mt-4 space-y-2 text-sm">
            {giftItems.length === 0 && (
              <p className="text-xs text-slate-500">まだアイテムが登録されていません。</p>
            )}

            {giftItems.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between border rounded-lg px-3 py-2"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-slate-500">目標：{item.target_amount ?? 0} 円</p>
                </div>
                <button
                  className="text-[11px] border border-slate-300 rounded-full px-3 py-1"
                  onClick={() => handleDeleteItem(item.id)}
                  type="button"
                >
                  削除
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
