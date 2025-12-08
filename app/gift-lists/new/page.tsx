// app/gift-lists/new/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function GiftListNewPage() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      setErrorMsg(null);

      // 1) ログインユーザ
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError || !userData.user) {
        router.push("/login");
        return;
      }

      const authUser = userData.user;

      // 2) app users テーブル
      const { data: appUser, error: appUserError } = await supabase
        .from("users")
        .select("id")
        .eq("auth_user_id", authUser.id)
        .single();

      if (appUserError || !appUser) {
        console.error(appUserError);
        setErrorMsg("ユーザー情報の取得に失敗しました。");
        return;
      }

      // 3) couple_profiles
      const { data: couple, error: coupleError } = await supabase
        .from("couple_profiles")
        .select("id")
        .eq("user_id", appUser.id)
        .single();

      if (coupleError || !couple) {
        console.error(coupleError);
        setErrorMsg("カップルプロフィールが見つかりません。");
        return;
      }

      // 4) 既に gift_list があればそれを使う
      const { data: lists, error: listsError } = await supabase
        .from("gift_lists")
        .select("id")
        .eq("couple_id", couple.id)
        .order("created_at", { ascending: true });

      if (listsError) {
        console.error(listsError);
        setErrorMsg("ギフトリストの取得に失敗しました。");
        return;
      }

      const existing = lists?.[0];

      if (existing) {
        // すでにあるならその編集ページへ
        router.replace(`/gift-lists/${existing.id}`);
        return;
      }

      // 5) なければデフォルトの gift_list を作成
      const { data: inserted, error: insertError } = await supabase
        .from("gift_lists")
        .insert({
          couple_id: couple.id,
          title: "新生活スタート応援リスト",
          description: "新生活で必要なものをまとめたご祝儀リストです。",
        })
        .select("id")
        .single();

      if (insertError || !inserted) {
        console.error(insertError);
        setErrorMsg("ギフトリストの作成に失敗しました。");
        return;
      }

      // 6) 作ったリストの編集ページへ
      router.replace(`/gift-lists/${inserted.id}`);
    };

    run();
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f5f2ec]">
      <div className="bg-white rounded-2xl shadow-md px-6 py-4 text-sm">
        <p>ご祝儀ページを準備しています…</p>
        {errorMsg && (
          <p className="mt-2 text-xs text-red-600 whitespace-pre-line">
            {errorMsg}
          </p>
        )}
      </div>
    </main>
  );
}
