'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  setErrorMsg(null);
  setLoading(true);

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log('signIn result', { data, error }); // ← 追加

    if (error) {
      console.error('login error', error);
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    // ログイン成功 → 強制的に /dashboard へ
    window.location.href = '/dashboard';
  } catch (e: any) {
    console.error('unexpected login error', e);
    setErrorMsg('予期せぬエラーが発生しました: ' + e.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md bg-white shadow-md rounded-xl p-6 space-y-4">
        <h1 className="text-xl font-bold text-center">
          WeddingFund ログイン
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="パスワード"
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
            {loading ? 'ログイン中…' : 'ログイン'}
          </button>
        </form>

        <p className="text-xs text-center text-slate-500">
          アカウントをお持ちでない方は{' '}
          <a href="/sign-up" className="text-blue-600 underline">
            サインアップ
          </a>
        </p>
      </div>
    </main>
  );
}
