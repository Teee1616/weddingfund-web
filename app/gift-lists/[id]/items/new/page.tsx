// web/app/gift-lists/[id]/items/new/page.tsx
'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function NewGiftItemPage() {
  const router = useRouter();
  const params = useParams();
  const listId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<string>(''); // target_amount に対応
  const [productUrl, setProductUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // 認証チェックだけしておく
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

    if (!name.trim()) {
      setErrorMsg('アイテム名を入力してください。');
      return;
    }

    setSubmitting(true);

    try {
      // target_amount として数値変換
      const amount =
        price.trim() === '' ? null : Number(price.replace(/,/g, ''));

      if (amount !== null && Number.isNaN(amount)) {
        setErrorMsg('価格は数値で入力してください。');
        setSubmitting(false);
        return;
      }

      // INSERT
      const { error: insertError } = await supabase.from('gift_items').insert({
        gift_list_id: listId,
        name: name.trim(),
        description: description.trim() || null,

        // DB の既存カラムに合わせた
        target_amount: amount,
        product_url: productUrl.trim() || null,
        image_url: imageUrl.trim() || null,
      });

      if (insertError) {
        console.error('insert gift_item error', insertError);
        setErrorMsg('アイテムの作成に失敗しました: ' + insertError.message);
        setSubmitting(false);
        return;
      }

      // リスト詳細ページへ戻る
      router.push(`/gift-lists/${listId}`);
    } catch (e: any) {
      console.error('unexpected error in create gift item', e);
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
        <button
          className="text-xs text-slate-500 underline"
          onClick={() => router.push(`/gift-lists/${listId}`)}
        >
          ← リストに戻る
        </button>

        <h1 className="text-xl font-bold text-center">アイテムを追加</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">アイテム名</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="例：ダイソン掃除機 V12"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">説明（任意）</label>
            <textarea
              className="w-full border rounded px-3 py-2 text-sm"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="例：新居で使いたいメインの掃除機です。"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">参考価格（円・任意）</label>
            <input
              type="text"
              inputMode="numeric"
              className="w-full border rounded px-3 py-2 text-sm"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="例：69800"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">
              購入リンク（任意・Amazon/Rakuten など）
            </label>
            <input
              type="url"
              className="w-full border rounded px-3 py-2 text-sm"
              value={productUrl}
              onChange={(e) => setProductUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm mb-1">
              商品画像 URL（任意）
            </label>
            <input
              type="url"
              className="w-full border rounded px-3 py-2 text-sm"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
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
            {submitting ? '追加中…' : '追加する'}
          </button>
        </form>
      </div>
    </main>
  );
}
