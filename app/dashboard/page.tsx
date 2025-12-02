'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

type GiftList = {
  id: string;
  title: string | null;
  description: string | null;
};

export default function DashboardPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [giftLists, setGiftLists] = useState<GiftList[]>([]);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      setErrorMsg(null);

      // 1) 現在の auth ユーザーを取得
      const { data: userData, error: getUserError } =
        await supabase.auth.getUser();

      if (getUserError || !userData.user) {
        // 未ログインならログインページへ
        router.push('/login');
        return;
      }

      const authUser = userData.user;

      // 2) public.users を取得（RLS: auth.uid() = auth_user_id 前提）
      const { data: appUser, error: appUserError } = await supabase
        .from('users')
        .select('id, display_name')
        .eq('auth_user_id', authUser.id)
        .single();

      if (appUserError || !appUser) {
        console.error('failed to fetch app user', appUserError);
        setErrorMsg('ユーザー情報の取得に失敗しました。');
        setLoading(false);
        return;
      }

      setDisplayName(appUser.display_name ?? authUser.email ?? null);

      // 3) couple_profiles を取得（1ユーザー1件想定）
      const { data: couple, error: coupleError } = await supabase
        .from('couple_profiles')
        .select('id')
        .eq('user_id', appUser.id)
        .single();

      if (coupleError || !couple) {
        console.error('failed to fetch couple profile', coupleError);
        setErrorMsg(
          'カップルプロフィールが見つかりません。サインアップ処理を確認してください。'
        );
        setLoading(false);
        return;
      }

      // 4) gift_lists を取得
      const { data: lists, error: listsError } = await supabase
        .from('gift_lists')
        .select('id, title, description')
        .eq('couple_id', couple.id)
        .order('created_at', { ascending: true });

      if (listsError) {
        console.error('failed to fetch gift lists', listsError);
        setErrorMsg('ギフトリストの取得に失敗しました。');
        setLoading(false);
        return;
      }

      setGiftLists(lists ?? []);
      setLoading(false);
    };

    loadDashboard();
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-slate-600">読み込み中…</p>
      </main>
    );
  }

  if (errorMsg) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="bg-white shadow-md rounded-xl p-6 max-w-md w-full">
          <p className="text-sm text-red-600 whitespace-pre-line">
            {errorMsg}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto py-10 px-4 space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">
              ようこそ、{displayName ?? 'カップルさん'}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              結婚祝いのギフトリストを管理できます。
            </p>
          </div>
          <button
            className="text-xs text-slate-500 underline"
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.href = '/login';
            }}
          >
            ログアウト
          </button>
        </header>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">あなたのギフトリスト</h2>
            <button
              className="text-xs bg-black text-white rounded px-3 py-1"
              onClick={() => router.push('/gift-lists/new')}
            >
              新しいリストを作成
            </button>
          </div>

          {giftLists.length === 0 ? (
            <p className="text-xs text-slate-500">
              まだギフトリストがありません。「新しいリストを作成」から始めましょう。
            </p>
          ) : (
            <ul className="space-y-2">
              {giftLists.map((list) => (
                <li
                  key={list.id}
                  className="bg-white border rounded-lg px-4 py-3 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {list.title || 'タイトル未設定'}
                    </p>
                    {list.description && (
                      <p className="text-xs text-slate-500">
                        {list.description}
                      </p>
                    )}
                  </div>
                  <button
                    className="text-xs text-blue-600 underline"
                    onClick={() => router.push(`/gift-lists/${list.id}`)}
                  >
                    詳細
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
