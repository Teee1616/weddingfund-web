// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type GiftList = {
  id: string;
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
  wedding_date: string | null;
  message_to_guests: string | null;
};

export default function DashboardPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [displayName, setDisplayName] = useState<string | null>(null);
  const [couple, setCouple] = useState<CoupleProfile | null>(null);
  const [giftList, setGiftList] = useState<GiftList | null>(null);
  const [giftItemCount, setGiftItemCount] = useState<number>(0);

  const [totalSupportAmount, setTotalSupportAmount] = useState<number>(0);
  const [supporterCount, setSupporterCount] = useState<number>(0);

  const [publishing, setPublishing] = useState(false);

  // 必須・任意判定用のフラグ
  const [hasGroomProfile, setHasGroomProfile] = useState(false);
  const [hasBrideProfile, setHasBrideProfile] = useState(false);

  const [hasGroomHistory, setHasGroomHistory] = useState(false);
  const [hasBrideHistory, setHasBrideHistory] = useState(false);
  const [hasCoupleHistory, setHasCoupleHistory] = useState(false);

  const [hasQa, setHasQa] = useState(false);
  const [hasPhotos, setHasPhotos] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErrorMsg(null);

      // 1) Supabase auth ユーザー
      const { data: userData, error: authError } = await supabase.auth.getUser();
      if (authError || !userData.user) {
        router.push("/login");
        setLoading(false);
        return;
      }
      const authUser = userData.user;

      // 2) app users テーブル
      const { data: appUserRow, error: appUserError } = await supabase
        .from("users")
        .select("id, display_name, email")
        .eq("auth_user_id", authUser.id)
        .single();

      if (appUserError || !appUserRow) {
        console.error(appUserError);
        setErrorMsg("ユーザー情報の取得に失敗しました。");
        setLoading(false);
        return;
      }

      setDisplayName(appUserRow.display_name ?? appUserRow.email ?? "ゲスト");

      // 3) couple_profiles を取得 or 作成（1ユーザー1件想定）
      const { data: coupleProfile, error: coupleError } = await supabase
        .from("couple_profiles")
        .select(
          "id, partner_name, partner_email, wedding_status, wedding_date, message_to_guests"
        )
        .eq("user_id", appUserRow.id)
        .maybeSingle();

      let coupleRow = coupleProfile as CoupleProfile | null;

      if (!coupleRow) {
        const { data: insertedCouple, error: insertCoupleError } =
          await supabase
            .from("couple_profiles")
            .insert({
              user_id: appUserRow.id,
              partner_name: null,
              partner_email: null,
              wedding_status: null,
              wedding_date: null,
              message_to_guests: null,
            })
            .select(
              "id, partner_name, partner_email, wedding_status, wedding_date, message_to_guests"
            )
            .single();

        if (insertCoupleError || !insertedCouple) {
          console.error(insertCoupleError);
          setErrorMsg("カップルプロフィールの作成に失敗しました。");
          setLoading(false);
          return;
        }
        coupleRow = insertedCouple as CoupleProfile;
      }

      setCouple(coupleRow);

      // 4) gift_lists（このカップルのメイン支援ページ）を取得 or 作成
      const { data: giftListData, error: listsError } = await supabase
        .from("gift_lists")
        .select("id, title, description, greeting_message, template_key")
        .eq("couple_id", coupleRow.id)
        .order("created_at", { ascending: true })
        .maybeSingle();

      let mainList = giftListData as GiftList | null;

      if (!mainList) {
        const { data: insertedList, error: insertListError } = await supabase
          .from("gift_lists")
          .insert({
            couple_id: coupleRow.id,
            title: "新生活スタートのご報告",
            description: "私たちの新生活へのご支援ページです。",
            currency: "JPY",
            template_key: "template1",
            greeting_message:
              "このたびは私たちの新生活にあたたかいお気持ちをお寄せいただき、ありがとうございます。",
          })
          .select("id, title, description, greeting_message, template_key")
          .single();

        if (insertListError || !insertedList) {
          console.error(insertListError);
          setErrorMsg("ご祝儀ページの作成に失敗しました。");
          setLoading(false);
          return;
        }
        mainList = insertedList as GiftList;
      }

      setGiftList(mainList);

      if (!mainList) {
        setLoading(false);
        return;
      }

      const giftListId = mainList.id;

      // 5) アイテム数（ほしいものリスト）
      const { count: itemCount, error: itemsError } = await supabase
        .from("gift_items")
        .select("id", { count: "exact", head: true })
        .eq("gift_list_id", giftListId);

      if (itemsError) {
        console.error(itemsError);
      }
      setGiftItemCount(itemCount ?? 0);

      // 6) person_profiles（新郎/新婦プロフィール）
      const { data: persons, error: personsError } = await supabase
        .from("person_profiles")
        .select("role")
        .eq("gift_list_id", giftListId);

      if (personsError) {
        console.error(personsError);
      } else {
        setHasGroomProfile(!!persons?.some((p) => p.role === "groom"));
        setHasBrideProfile(!!persons?.some((p) => p.role === "bride"));
      }

      // 7) histories（新郎/新婦/二人のヒストリー）
      const { data: histories, error: historiesError } = await supabase
        .from("histories")
        .select("role")
        .eq("gift_list_id", giftListId);

      if (historiesError) {
        console.error(historiesError);
      } else {
        setHasGroomHistory(
          histories?.some((h) => h.role === "groom") ?? false
        );
        setHasBrideHistory(
          histories?.some((h) => h.role === "bride") ?? false
        );
        setHasCoupleHistory(
          histories?.some((h) => h.role === "couple") ?? false
        );
      }

      // 8) 一問一答（couple_qa）
      const { count: qaCount, error: qaError } = await supabase
        .from("couple_qa")
        .select("id", { count: "exact", head: true })
        .eq("gift_list_id", giftListId);

      if (qaError) {
        console.error(qaError);
      }
      setHasQa((qaCount ?? 0) > 0);

      // 9) 写真集（couple_photos）
      const { count: photoCount, error: photoError } = await supabase
        .from("couple_photos")
        .select("id", { count: "exact", head: true })
        .eq("gift_list_id", giftListId);

      if (photoError) {
        console.error(photoError);
      }
      setHasPhotos((photoCount ?? 0) > 0);

      // ※ totalSupportAmount / supporterCount は後で contributions から集計予定

      setLoading(false);
    };

    load();
  }, [router]);

  // -------- ローディング & エラー表示 --------
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#f5f2ec]">
        <p className="text-sm text-slate-600">読み込み中…</p>
      </main>
    );
  }

  if (errorMsg) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#f5f2ec]">
        <div className="bg-white shadow-md rounded-xl p-6 max-w-md w-full">
          <p className="text-sm text-red-600 whitespace-pre-line">
            {errorMsg}
          </p>
        </div>
      </main>
    );
  }

  // -------- 進捗計算（必須 5 項目） --------
  const templateDone = !!giftList?.template_key;
  const greetingDone = !!giftList?.greeting_message;
  const groomProfileDone = hasGroomProfile;
  const brideProfileDone = hasBrideProfile;
  const wishlistDone = giftItemCount > 0;

  const requiredTotal = 5;
  const requiredDone =
    Number(templateDone) +
    Number(greetingDone) +
    Number(groomProfileDone) +
    Number(brideProfileDone) +
    Number(wishlistDone);
  const progressPercent = Math.round((requiredDone / requiredTotal) * 100);

  // -------- ページ公開（Stripe 決済） --------
  const handlePublish = async () => {
    if (!giftList) return;
    if (requiredDone < requiredTotal) {
      alert("必須項目をすべて入力してください。");
      return;
    }

    try {
      setPublishing(true);

      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "publish_fee",
          projectId: giftList.id,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("決済URLの取得に失敗しました。");
      }
    } catch (e) {
      console.error(e);
      alert("公開処理中にエラーが発生しました。");
    } finally {
      setPublishing(false);
    }
  };

  const goToEdit = () => {
    if (!giftList) return;
    router.push(`/dashboard/projects/${giftList.id}/edit`);
  };

  // -------- JSX --------
  return (
    <main className="min-h-screen bg-[#f5f2ec]">
      <div className="max-w-5xl mx-auto py-10 px-4 flex gap-6">
        {/* 左サイドバー */}
        <aside className="w-64 bg-white rounded-2xl shadow-md p-5 flex flex-col gap-6">
          <div>
            <p className="text-xs text-slate-500 mb-1">お名前</p>
            <p className="text-sm font-semibold">
              {displayName ?? "ゲスト"}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500 mb-1">サポートメニュー</p>
            <div className="space-y-2">
              <button className="w-full text-xs border border-slate-200 rounded-full py-2">
                お問い合わせ
              </button>
              <button className="w-full text-xs border border-slate-200 rounded-full py-2">
                ガイド集
              </button>
            </div>
          </div>

          <button
            className="mt-auto text-xs text-slate-500 underline"
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.href = "/login";
            }}
          >
            ログアウト
          </button>
        </aside>

        {/* 右メインエリア */}
        <section className="flex-1 space-y-6">
          {/* あいさつ ＋ ご祝儀ページ作成 */}
          <div className="bg-white rounded-2xl shadow-md p-6 space-y-6">
            {/* あいさつ部分 */}
            <div>
              <p className="text-xs text-slate-500 mb-2">
                ご登録ありがとうございます。新生活のおひろめやマリフの使い方をご案内します。
              </p>
              <h1 className="text-xl font-bold mb-4">
                {displayName ?? "ご夫婦"} 様、はじめまして！
              </h1>

              <ol className="space-y-3 text-sm">
                <li>
                  <p className="font-semibold mb-1">
                    ① 新郎新婦様のお名前・基本情報
                  </p>
                  <p className="text-xs text-slate-600 mb-1">
                    ご紹介ページに表示するお名前や挙式予定日などを登録します。
                  </p>
                  <button
                    className="mt-1 text-xs bg黒 text-white rounded px-3 py-1 bg-black"
                    onClick={goToEdit}
                  >
                    編集する
                  </button>
                </li>
              </ol>
            </div>

            {/* ご祝儀ページ作成ステップ */}
            <div className="border-t border-slate-100 pt-4 space-y-4">
              <h2 className="text-sm font-semibold mb-2">ご祝儀ページ作成</h2>

              {/* 進捗バー */}
              <div className="mb-2">
                <p className="text-xs text-slate-600 mb-1">
                  進捗状況：{requiredDone}/{requiredTotal} 件 完了
                </p>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#c49a6c]"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* 必須項目チェックリスト */}
              <div className="space-y-2 text-xs">
                <SectionRow
                  label="テンプレート選択"
                  done={templateDone}
                  onClick={goToEdit}
                />
                <SectionRow
                  label="挨拶文言"
                  done={greetingDone}
                  onClick={goToEdit}
                />
                <SectionRow
                  label="新郎プロフィール"
                  done={groomProfileDone}
                  onClick={goToEdit}
                />
                <SectionRow
                  label="新婦プロフィール"
                  done={brideProfileDone}
                  onClick={goToEdit}
                />
                <SectionRow
                  label="ほしいものリスト"
                  done={wishlistDone}
                  onClick={goToEdit}
                />
              </div>

              {/* 任意項目 */}
              <div className="mt-4">
                <p className="text-xs text-slate-500 mb-1">
                  任意項目（登録しなくてもページ公開はできます）
                </p>
                <div className="space-y-2 text-xs">
                  <SectionRow
                    label="新郎ヒストリー"
                    done={hasGroomHistory}
                    onClick={goToEdit}
                  />
                  <SectionRow
                    label="新婦ヒストリー"
                    done={hasBrideHistory}
                    onClick={goToEdit}
                  />
                  <SectionRow
                    label="新郎新婦のヒストリー"
                    done={hasCoupleHistory}
                    onClick={goToEdit}
                  />
                  <SectionRow
                    label="一問一答"
                    done={hasQa}
                    onClick={goToEdit}
                  />
                  <SectionRow
                    label="写真集"
                    done={hasPhotos}
                    onClick={goToEdit}
                  />
                </div>
              </div>

              {/* プレビュー & 公開ボタン */}
              <div className="mt-4 flex gap-3">
                <button
                  className="flex-1 border border-slate-300 text-xs rounded-full py-2 disabled:opacity-60"
                  onClick={goToEdit}
                  disabled={!giftList}
                >
                  ページのプレビュー / 編集
                </button>

                <button
                  className="flex-1 bg-[#c49a6c] text-white text-xs rounded-full py-2 disabled:opacity-60"
                  disabled={!giftList || requiredDone < requiredTotal || publishing}
                  onClick={handlePublish}
                >
                  {publishing ? "処理中…" : "ページを作成する（¥3,000）"}
                </button>
              </div>
            </div>
          </div>

          {/* 支援状況（ダミー） */}
          <div className="bg-white rounded-2xl shadow-md p-6 space-y-2">
            <h2 className="text-sm font-semibold mb-2">支援状況</h2>
            <p className="text-xs text-slate-600">
              Stripe 連携と contributions テーブルが整ったら、ここに
              「集まったご祝儀の合計金額」と「支援者数」を表示します。
            </p>
            <p className="text-sm mt-2">
              現在のご支援合計：¥{totalSupportAmount.toLocaleString()}
            </p>
            <p className="text-sm">
              支援者数：{supporterCount.toLocaleString()} 名
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

type SectionRowProps = {
  label: string;
  done: boolean;
  onClick: () => void;
};

function SectionRow({ label, done, onClick }: SectionRowProps) {
  return (
    <div className="flex items-center justify-between bg-slate-50 rounded-xl px-3 py-2">
      <div className="flex items-center gap-2">
        <span
          className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
            done
              ? "bg-[#c49a6c] border-[#c49a6c] text-white"
              : "border-slate-300 text-slate-400"
          }`}
        >
          {done ? "✓" : ""}
        </span>
        <span className="text-xs">{label}</span>
      </div>
      <button
        className="text-[11px] bg-white border border-slate-300 rounded-full px-3 py-1"
        onClick={onClick}
      >
        作成する
      </button>
    </div>
  );
}
