'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

type AuthState = 'checking' | 'authed' | 'no-auth';

type AppUser = {
  id: string;
  email: string;
  display_name: string | null;
};

export default function DashboardPage() {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>('checking');
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      // 1) セッション確認
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error('getSession error', sessionError);
      }

      if (!session) {
        setAuthState('no-auth');
        router.replace('/login');
        return;
      }

      setAuthState('authed');

      // 2) アプリ側 users テーブルからユーザー情報取得
      setLoadingUser(true);
      setErrorMsg(null);

      const authUserId = session.user.id;

      const { data, error } = await supabase
        .from('users')
        .select('id, email, display_name')
        .eq('auth_user_id', authUserId)
        .single();

      if (error) {
        console.error('fetch app user error', error);
        setErrorMsg('ユーザー情報の取得に失敗しました。');
      } else if (data) {
        setAppUser(data as AppUser);
      }

      setLoadingUser(false);
    };

    init();
  }, [router]);

  // ログインチェック中
  if (authState === 'checking') {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>ログイン状態を確認中…</p>
      </main>
    );
  }

  // 未ログイン → /login に飛ばす途中
  if (authState === 'no-auth') {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>ログインしていません。ログインページへ移動します…</p>
      </main>
    );
  }

  // ここに来るのは「ログイン済み」のときだけ
  return (
    <main className="min-h-screen p-6 bg-slate-50">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">ダッシュボード</h1>

          {loadingUser && (
            <p className="text-sm text-slate-500 mt-1">
              ユーザー情報を読み込み中…
            </p>
          )}

          {appUser && (
            <p className="text-sm text-slate-700 mt-1">
              こんにちは、
              <span className="font-semibold">
                {appUser.display_name || appUser.email}
              </span>
              さん
            </p>
          )}

          {errorMsg && (
            <p className="text-sm text-red-600 mt-1">{errorMsg}</p>
          )}
        </div>

        <button
          className="text-sm text-red-600 underline"
          onClick={async () => {
            await supabase.auth.signOut();
            window.location.href = '/login';
          }}
        >
          ログアウト
        </button>
      </header>

      <section className="mt-4">
        <h2 className="text-lg font-semibold mb-2">今後ここに追加するもの</h2>
        <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
          <li>ギフトリスト一覧</li>
          <li>新規ギフトリスト作成ボタン</li>
          <li>支援状況のサマリー</li>
        </ul>
      </section>
    </main>
  );
}
