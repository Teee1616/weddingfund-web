// web/app/gift-lists/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function GiftListDetailPage() {
  const router = useRouter();
  const params = useParams(); // ← Next.js App Router
  const listId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [list, setList] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErrorMsg(null);

      // ① 認証チェック
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        router.push('/login');
        return;
      }

      // ② gift_lists を取得（RLS で自分のしか読めない）
      const { data: listData, error: listError } = await supabase
        .from('gift_lists')
        .select('*')
        .eq('id', listId)
        .single();

      if (listError || !listData) {
        console.error(listError);
        setErrorMsg('ギフトリストの取得に失敗しました。');
        setLoading(false);
        return;
      }

      setList(listData);

      // ③ gift_items を取得
      const { data: itemsData, error: itemsError } = await supabase
        .from('gift_items')
        .select('*')
        .eq('gift_list_id', listId)
        .order('created_at');

      if (itemsError) {
        console.error(itemsError);
        setErrorMsg('アイテム一覧の取得に失敗しました。');
        setLoading(false);
        return;
      }

      setItems(itemsData ?? []);
      setLoading(false);
    };

    load();
  }, [listId, router]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600 text-sm">読み込み中…</p>
      </main>
    );
  }

  if (errorMsg) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 text-sm">{errorMsg}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto py-10 px-4 space-y-6">
        <button
          className="text-xs text-slate-500 underline"
          onClick={() => router.push('/dashboard')}
        >
          ← ダッシュボードへ戻る
        </button>

        <h1 className="text-xl font-bold">{list.title}</h1>
        {list.description && (
          <p className="text-sm text-slate-600">{list.description}</p>
        )}

        <div className="flex items-center justify-between mt-6">
          <h2 className="text-sm font-semibold">アイテム一覧</h2>
          <button
            className="text-xs bg-black text-white px-3 py-1 rounded"
            onClick={() => router.push(`/gift-lists/${listId}/items/new`)}
          >
            アイテムを追加
          </button>
        </div>

        {items.length === 0 ? (
          <p className="text-xs text-slate-500">まだアイテムがありません。</p>
        ) : (
          <ul className="space-y-3">
            {items.map((item) => (
              <li
                key={item.id}
                className="bg-white rounded-lg border px-4 py-3"
              >
                <p className="text-sm font-medium">{item.name}</p>
                {item.price && (
                  <p className="text-xs text-slate-500">
                    価格: ¥{item.price.toLocaleString()}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
