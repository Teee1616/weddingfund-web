// app/greeting/edit/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function GreetingEditPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErrorMsg(null);

      // 1) ログインユーザー確認
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError || !userData.user) {
        router.push('/login');
        return;
      }
      const authUser = userData.user;

      // 2) app users 取得
      const { data: appUser, error: appUserError } = await supabase
        .from('users')
        .select('id, display_name, email')
        .eq('auth_user_id', authUser.id)
        .single();

      if (appUserError || !appUser) {
        console.error(appUserError);
        setErrorMsg('ユーザー情報の取得に失敗しました。');
        setLoading(false);
        return;
      }

      // 3) couple_profiles 取得（message_to_guests を読み込む）
      const { data: coupleProfile, error: coupleError } = await supabase
        .from('couple_profiles')
        .select('id, message_to_guests')
        .eq('user_id', appUser.id)
        .single();

      if (coupleError || !coupleProfile) {
        console.error(coupleError);
        setErrorMsg('カップルプロフィールが見つかりません。');
        setLoading(false);
        return;
      }

      setGreeting(coupleProfile.message_to_guests ?? '');
      setLoading(false);
    };

    load();
  }, [router]);

  const handleSave = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      setSaving(true);

      // 再度ユーザー＆カップルIDだけ取得（簡易に同じ処理）
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

      // 挨拶文を更新
      const { error: updateError } = await supabase
        .from('couple_profiles')
        .update({
          message_to_guests: greeting,
        })
        .eq('id', coupleProfile.id);

      if (updateError) {
        console.error(updateError);
        setErrorMsg('挨拶文の保存に失敗しました。');
        setSaving(false);
        return;
      }

      setSuccessMsg('挨拶文を保存しました。');
      setSaving(false);
    } catch (e) {
      console.error(e);
      setErrorMsg('予期せぬエラーが発生しました。');
      setSaving(false);
    }
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
        {/* ヘッダー */}
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-lg font-bold text-[#7a5a3c]">
            挨拶文の作成・編集
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
            ゲストの皆さまに向けたご挨拶文を入力してください。改行もそのまま反映され、プレビュー画面の
            「MESSAGE」 セクションに表示されます。
          </p>

          <label className="block text-xs font-semibold text-slate-700 mb-1">
            挨拶文
          </label>
          <textarea
            className="w-full h-60 text-sm border border-slate-300 rounded-xl px-3 py-2 resize-vertical focus:outline-none focus:ring-2 focus:ring-[#c49a6c] focus:border-[#c49a6c]"
            value={greeting}
            onChange={(e) => setGreeting(e.target.value)}
            placeholder={
              '例）\n時下ますますご清栄のこととお慶び申し上げます。\n\nこのたび私たちは入籍し、新生活をスタートいたしました。\nこれからも二人で力を合わせ、明るい家庭を築いてまいります。\n今後とも変わらぬご支援のほど、よろしくお願い申し上げます。'
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
