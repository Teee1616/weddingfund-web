// web/app/gift-lists/new/page.tsx
'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function NewGiftListPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // ログイン確認だけしておく（未ログインなら /login に飛ばす）
  useEffect(() => {
    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        router.push('/login');
        return;
      }
      setLoading(false);
    };
    checkAuth();
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!title.trim()) {
      setErrorMsg('リストのタイトルを入力してください。');
      return;
    }

    setSubmitting(true);

    try {
      // 1) 現在の auth ユーザーを取得
      const { data: userData, error: getUserError } =
        await supabase.auth.getUser();
      if (getUserError || !userData.user) {
        setErrorMsg('ログイン情報を取得できませんでした。');
        setSubmitting(false);
        return;
      }
      const authUser = userData.user;

      // 2) public.users.id を取得
      const { data: appUser, error: appUserError } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', authUser.id)
        .single();

      if (appUserError || !appUser) {
        console.error('failed to fetch app user', appUserError);
        setErrorMsg('ユーザー情報の取得に失敗しました。');
        setSubmitting(false);
        return;
      }

      // 3) couple_profiles.id を取得
      const { data: couple, error: coupleError } = await supabase
        .from('couple_profiles')
        .select('id')
        .eq('user_id', appUser.id)
        .single();

      if (coupleError || !couple) {
        console.error('failed to fetch couple profile', coupleError);
        setErrorMsg('カップルプロフィールが見つかりませんでした。');
        setSubmitting(false);
        return;
      }

      // 4) gift_lists に INSERT
      const { data: newList, error: insertError } = await supabase
        .from('gift_lists')
        .insert({
          couple_id: couple.id,
          title: title.trim(),
          description: description.trim() || null,
        })
        .select('id')
        .single();

      if (insertError || !newList) {
        console.error('insert gift_list error', insertError);
        setErrorMsg('ギフトリストの作成に失敗しました。');
        setSubmitting(false);
        return;
      }

      // 5) 作成したリストの詳細ページへ飛ばす（後で実装）
      router.push(`/gift-lists/${newList.id}`);
    } catch (e: any) {
      console.error('unexpected error in create gift list', e);
      setErrorMsg('予期せぬエラーが発生しました: ' + e.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-slate-600">読み込み中…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md bg-white shadow-md rounded-xl p-6 space-y-4">
        <h1 className="text-xl font-bold text-center">新しいギフトリスト</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">リスト名</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 text-sm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例：新生活スタート応援リスト"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">説明（任意）</label>
            <textarea
              className="w-full border rounded px-3 py-2 text-sm"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="例：家電や家具など、新生活で必要なものをまとめています。"
            />
          </div>

          {errorMsg && (
            <p className="text-sm text-red-600 whitespace-pre-line">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-black text-white py-2 rounded text-sm font-semibold disabled:opacity-60"
          >
            {submitting ? '作成中…' : '作成する'}
          </button>
        </form>
      </div>
    </main>
  );
}
