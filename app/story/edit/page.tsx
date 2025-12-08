// app/story/edit/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function CoupleStoryEditPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [storyText, setStoryText] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErrorMsg(null);

      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError || !userData.user) {
        router.push('/login');
        return;
      }

      const { data: appUser, error: appUserError } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', userData.user.id)
        .single();

      if (appUserError || !appUser) {
        setErrorMsg('ユーザー情報の取得に失敗しました。');
        setLoading(false);
        return;
      }

      const { data: coupleProfile, error: coupleError } = await supabase
        .from('couple_profiles')
        .select('id, couple_story')
        .eq('user_id', appUser.id)
        .single();

      if (coupleError || !coupleProfile) {
        setErrorMsg('カップルプロフィールが見つかりません。');
        setLoading(false);
        return;
      }

      setStoryText(coupleProfile.couple_story ?? '');
      setLoading(false);
    };

    load();
  }, [router]);

  const handleSave = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setSaving(true);

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      router.push('/login');
      return;
    }

    const { data: appUser } = await supabase
      .from('users')
      .select('id')
      .eq('auth_user_id', userData.user.id)
      .single();

    if (!appUser) {
      setErrorMsg('ユーザー情報が取得できませんでした。');
      setSaving(false);
      return;
    }

    const { data: coupleProfile } = await supabase
      .from('couple_profiles')
      .select('id')
      .eq('user_id', appUser.id)
      .single();

    if (!coupleProfile) {
      setErrorMsg('カップルプロフィールが見つかりません。');
      setSaving(false);
      return;
    }

    const { error: updateError } = await supabase
      .from('couple_profiles')
      .update({ couple_story: storyText })
      .eq('id', coupleProfile.id);

    if (updateError) {
      console.error(updateError);
      setErrorMsg('出会いのストーリーの保存に失敗しました。');
      setSaving(false);
      return;
    }

    setSuccessMsg('出会いのストーリーを保存しました。');
    setSaving(false);
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#f5f2ec]">
        <p className="text-sm text-slate-600">読み込み中…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f2ec]">
      <div className="max-w-3xl mx-auto py-10 px-4">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-lg font-bold text-[#7a5a3c]">
            二人の出会いストーリーの作成・編集
          </h1>
          <button
            className="text-xs text-slate-600 underline"
            onClick={() => router.push('/dashboard')}
          >
            ダッシュボードに戻る
          </button>
        </header>

        <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
          <p className="text-xs text-slate-600">
            二人の出会いや、印象的なエピソードを書いてください。HISTORY もしくは別セクションで表示する想定です。
          </p>

          <textarea
            className="w-full h-60 text-sm border border-slate-300 rounded-xl px-3 py-2 resize-vertical focus:outline-none focus:ring-2 focus:ring-[#c49a6c] focus:border-[#c49a6c]"
            value={storyText}
            onChange={(e) => setStoryText(e.target.value)}
            placeholder={
              '例）\n大学1年の春、同じサークルの新歓で初めて出会いました。\n最初は友人として仲良くなり、課題やイベントを一緒に乗り越えるうちに、自然とお互いを大切な存在だと意識するようになりました。'
            }
          />

          {errorMsg && (
            <p className="text-xs text-red-600 whitespace-pre-line">
              {errorMsg}
            </p>
          )}
          {successMsg && (
            <p className="text-xs text-emerald-600 whitespace-pre-line">
              {successMsg}
            </p>
          )}

          <div className="flex gap-3 mt-4">
            <button
              className="px-4 py-2 text-xs rounded-full border border-slate-300 bg-white"
              onClick={() => router.push('/dashboard')}
            >
              キャンセル
            </button>
            <button
              className="px-5 py-2 text-xs rounded-full bg-[#c49a6c] text-white disabled:opacity-60"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? '保存中…' : '保存する'}
            </button>
            <button
              className="ml-auto px-5 py-2 text-xs rounded-full border border-[#c49a6c] text-[#c49a6c]"
              onClick={() => router.push('/dashboard')}
            >
              プレビューを確認する
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
