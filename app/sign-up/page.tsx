'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function SignUpPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg('メールアドレスとパスワードを入力してください。');
      return;
    }

    setLoading(true);

    try {
      // 1) Supabase Auth にユーザー作成
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email,
          password,
        });

      if (signUpError) {
        setErrorMsg(signUpError.message);
        setLoading(false);
        return;
      }

      // メール確認 OFF 前提なら signUp 後にセッションがある想定
      const { data: userData, error: getUserError } =
        await supabase.auth.getUser();

      if (getUserError || !userData.user) {
        console.error('getUser error after signup', getUserError);
        setErrorMsg('ユーザー作成に失敗しました。もう一度お試しください。');
        setLoading(false);
        return;
      }

      const authUser = userData.user;

      // 2) アプリ側 users テーブルにレコード作成（or 更新）
      const { error: upsertUserError } = await supabase
        .from('users')
        .upsert(
          {
            auth_user_id: authUser.id,
            email,
            display_name: displayName || null,
          },
          { onConflict: 'auth_user_id' }
        );

      if (upsertUserError) {
        console.error('users upsert error', upsertUserError);
        setErrorMsg(
          'アプリ側ユーザーの作成に失敗しました: ' +
            upsertUserError.message
        );
        setLoading(false);
        return;
      }

      // 3) users.id を取得して couple_profiles を作成
      const { data: appUser, error: fetchUserError } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', authUser.id)
        .single();

      if (fetchUserError || !appUser) {
        console.error('fetch app user error', fetchUserError);
        setErrorMsg(
          'ユーザープロフィール取得に失敗しました: ' +
            (fetchUserError?.message ?? '')
        );
        setLoading(false);
        return;
      }

      const { error: insertCoupleError } = await supabase
        .from('couple_profiles')
        .insert({
          user_id: appUser.id,
          partner_name: null,
          partner_email: null,
          wedding_status: null,
          wedding_date: null,
          message_to_guests: null,
        });

      if (insertCoupleError) {
        console.error('insert couple_profiles error', insertCoupleError);
        setErrorMsg(
          'カップルプロフィールの作成に失敗しました: ' +
            insertCoupleError.message
        );
        setLoading(false);
        return;
      }

      // 4) ダッシュボードへ遷移
      router.push('/dashboard');
    } catch (e: any) {
      console.error('unexpected sign-up error', e);
      setErrorMsg('予期せぬエラーが発生しました: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md bg-white shadow-md rounded-xl p-6 space-y-4">
        <h1 className="text-xl font-bold text-center">
          WeddingFund アカウント作成
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">表示名（任意）</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 text-sm"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="例：ルイス＆◯◯"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">メールアドレス</label>
            <input
              type="email"
              className="w-full border rounded px-3 py-2 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">パスワード</label>
            <input
              type="password"
              className="w-full border rounded px-3 py-2 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="6文字以上"
            />
          </div>

          {errorMsg && (
            <p className="text-sm text-red-600 whitespace-pre-line">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded text-sm font-semibold disabled:opacity-60"
          >
            {loading ? '作成中…' : 'サインアップ'}
          </button>
        </form>

        <p className="text-xs text-center text-slate-500">
          すでにアカウントをお持ちの方は{' '}
          <a href="/login" className="text-blue-600 underline">
            ログイン
          </a>
        </p>
      </div>
    </main>
  );
}
