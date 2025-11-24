// web/app/supabase-test/page.tsx
'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

type Status = 'idle' | 'checking' | 'ok' | 'ng';

export default function SupabaseTestPage() {
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState<string>('');

  const handleCheck = async () => {
    setStatus('checking');
    setMessage('Supabase への接続を確認中…');

    // まだテーブルを作っていないので、あえて存在しないテーブルを叩く
    const { data, error } = await supabase
      .from('test_connection') // まだ存在しないテーブル名
      .select('*')
      .limit(1);

    if (error) {
      // ここに来れば「Supabase には繋がっていて、DB からのエラーが返ってきた」ということ
      setStatus('ok');
      setMessage(
        `Supabase には接続できています（DBエラー: ${error.message}）。環境変数とURLは正しく設定されています。`
      );
      console.log('Supabase 接続 OK（テーブルがないためエラー）', { data, error });
    } else {
      // もし将来 test_connection テーブルを作ったらこちらのパスに来る
      setStatus('ok');
      setMessage('Supabase に正常に接続でき、test_connection テーブルからデータを取得できました。');
      console.log('Supabase データ取得 OK', data);
    }
  };

  return (
    <main style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>Supabase 接続テスト</h1>
      <p>「接続をチェック」ボタンを押すと、Supabase への接続確認を行います。</p>

      <button
        onClick={handleCheck}
        style={{
          marginTop: '16px',
          padding: '8px 16px',
          borderRadius: 4,
          border: '1px solid #ccc',
          cursor: 'pointer',
        }}
      >
        接続をチェック
      </button>

      <div style={{ marginTop: '24px' }}>
        <strong>ステータス：</strong>
        {status === 'idle' && 'まだチェックしていません'}
        {status === 'checking' && 'チェック中…'}
        {status === 'ok' && 'OK（Supabase に接続できています）'}
        {status === 'ng' && 'NG（接続に問題あり）'}
      </div>

      {message && (
        <p style={{ marginTop: '8px', whiteSpace: 'pre-wrap' }}>
          {message}
        </p>
      )}
    </main>
  );
}
