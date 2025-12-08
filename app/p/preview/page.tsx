'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

type GiftList = {
  id: string;
  title: string | null;
  description: string | null;
  couple_id: string | null;
};

type CoupleProfile = {
  id: string;
  partner_name: string | null;
  wedding_status: string | null;
  wedding_date: string | null;
  message_to_guests: string | null;
};

type GiftItem = {
  id: string;
  name: string | null;
  description: string | null;
  target_amount: number | null;
};

export default function PreviewPage() {
  const searchParams = useSearchParams();
  const giftListId = searchParams.get('giftListId') ?? '';

  const [giftList, setGiftList] = useState<GiftList | null>(null);
  const [couple, setCouple] = useState<CoupleProfile | null>(null);
  const [items, setItems] = useState<GiftItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErrorMsg(null);

      if (!giftListId) {
        setErrorMsg('プレビュー用URLが不正です。（giftListId が指定されていません）');
        setLoading(false);
        return;
      }

      // 1) gift_lists
      const { data: gl, error: glError } = await supabase
        .from('gift_lists')
        .select('id, title, description, couple_id')
        .eq('id', giftListId)
        .maybeSingle();

      if (glError || !gl) {
        console.error(glError);
        setErrorMsg('ご祝儀ページ（ギフトリスト）が見つかりません。');
        setLoading(false);
        return;
      }
      setGiftList(gl);

      // 2) couple_profiles
      if (gl.couple_id) {
        const { data: cp, error: cpError } = await supabase
          .from('couple_profiles')
          .select(
            'id, partner_name, wedding_status, wedding_date, message_to_guests'
          )
          .eq('id', gl.couple_id)
          .maybeSingle();

        if (cpError) {
          console.error(cpError);
        } else {
          setCouple(cp);
        }
      }

      // 3) gift_items
      const { data: gi, error: giError } = await supabase
        .from('gift_items')
        .select('id, name, description, target_amount')
        .eq('gift_list_id', gl.id)
        .order('created_at', { ascending: true });

      if (giError) {
        console.error(giError);
      } else if (gi) {
        setItems(gi);
      }

      setLoading(false);
    };

    load();
  }, [giftListId]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#f5f2ec]">
        <p className="text-xs tracking-[0.2em] text-slate-500">
          PREVIEW LOADING...
        </p>
      </main>
    );
  }

  if (errorMsg) {
    return (
      <main className="min-h-screen bg-[#f5f2ec] flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-md px-10 py-8 text-center">
          <p className="text-sm text-red-600 mb-4">{errorMsg}</p>
          <Link
            href="/dashboard"
            className="text-xs text-blue-600 underline"
          >
            ダッシュボードへ戻る
          </Link>
        </div>
      </main>
    );
  }

  // ----- 表示用の整形 -----
  const heroTitle =
    giftList?.title ?? 'Wedding Celebration Page';

  const weddingDateText =
    couple?.wedding_date ??
    (couple?.wedding_status ? `${couple.wedding_status}` : '');

  const message =
    couple?.message_to_guests ??
    'ゲストへのご挨拶文がまだ登録されていません。ダッシュボードから挨拶文を作成してください。';

  // 名前はまだテーブル分割していないので、ひとまずパートナー名＋「ご夫妻」という形にしておく
  const coupleNames =
    couple?.partner_name
      ? `${couple.partner_name} & PARTNER`
      : heroTitle;

  return (
    <main className="min-h-screen bg-[#f5f2ec] text-[#4a3b32]">
      {/* TOP NAV */}
      <header className="sticky top-0 z-30 bg-[#f5f2ec]/90 backdrop-blur border-b border-[#e4d8c8]">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
          <p className="text-xs tracking-[0.25em] font-semibold">
            MARIF
          </p>
          <nav className="flex gap-4 text-[11px] tracking-[0.15em]">
            <a href="#message" className="hover:opacity-70">
              MESSAGE
            </a>
            <a href="#profile" className="hover:opacity-70">
              PROFILE
            </a>
            <a href="#history" className="hover:opacity-70">
              HISTORY
            </a>
            <a href="#qa" className="hover:opacity-70">
              Q&amp;A
            </a>
            <a href="#gallery" className="hover:opacity-70">
              GALLERY
            </a>
            <a href="#support" className="hover:opacity-70">
              SUPPORT
            </a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          {/* 擬似的なファブリック背景 */}
          <div className="w-full h-full bg-gradient-to-br from-[#f8f3eb] via-[#f0e4d7] to-[#f7eee6]" />
        </div>
        <div className="relative max-w-4xl mx-auto py-24 px-4 text-center">
          <p className="text-[10px] tracking-[0.35em] text-[#b59a7d] mb-4">
            WEDDING CELEBRATION
          </p>
          <div className="mb-4 flex items-center justify-center gap-6 text-[#c4a27a]">
            <span className="h-px w-16 bg-[#d2b58b]" />
            <span className="text-2xl font-serif">&amp;</span>
            <span className="h-px w-16 bg-[#d2b58b]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif tracking-[0.12em] mb-4">
            {coupleNames}
          </h1>
          {weddingDateText && (
            <p className="text-xs tracking-[0.25em] text-[#8f7c69] uppercase mb-8">
              {weddingDateText}
            </p>
          )}
          <p className="max-w-xl mx-auto text-[11px] text-[#85715f] leading-relaxed">
            {giftList?.description ??
              '新生活のスタートにあたり、ご祝儀ページをご覧いただきありがとうございます。'}
          </p>
        </div>
      </section>

      {/* MESSAGE */}
      <section
        id="message"
        className="max-w-3xl mx-auto mt-16 mb-12 bg-white/90 rounded-3xl shadow-sm px-8 md:px-12 py-10"
      >
        <p className="text-[10px] tracking-[0.3em] text-center text-[#b59a7d] mb-1">
          ごあいさつ
        </p>
        <h2 className="text-xl font-serif text-center tracking-[0.18em] mb-6">
          MESSAGE
        </h2>
        <p className="text-sm leading-7 whitespace-pre-line text-center text-[#4b3d33]">
          {message}
        </p>
        {couple?.partner_name && (
          <p className="mt-8 text-xs text-right text-[#6b5646]">
            {couple.partner_name} ご夫妻
          </p>
        )}
      </section>

      {/* PROFILE */}
      <section id="profile" className="max-w-4xl mx-auto mb-16 px-4">
        <p className="text-[10px] tracking-[0.3em] text-center text-[#b59a7d] mb-1">
          新郎新婦のプロフィール
        </p>
        <h2 className="text-xl font-serif text-center tracking-[0.18em] mb-8">
          PROFILE
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Groom-like card */}
          <div className="bg-white rounded-3xl shadow-sm overflow-hidden flex flex-col md:flex-row">
            <div className="md:w-1/2 bg-gradient-to-br from-[#e6f3ff] to-[#c9e0ff] flex items-center justify-center p-6">
              <div className="w-full aspect-[4/3] rounded-2xl bg-gradient-to-b from-[#cbe8ff] to-[#88c267]" />
            </div>
            <div className="md:w-1/2 p-6 flex flex-col justify-between">
              <div>
                <p className="text-[10px] tracking-[0.25em] text-[#b59a7d] mb-1">
                  PARTNER
                </p>
                <p className="text-lg font-serif mb-3">
                  {couple?.partner_name ?? 'Partner Name'}
                </p>
                <p className="text-xs text-[#6b5646] leading-relaxed">
                  パートナー様のプロフィール情報は、のちほど専用入力ページと連携して表示します。
                  現時点ではダミーの説明文です。
                </p>
              </div>
            </div>
          </div>

          {/* Another card (自分側・仮） */}
          <div className="bg-white rounded-3xl shadow-sm overflow-hidden flex flex-col md:flex-row">
            <div className="md:w-1/2 bg-gradient-to-br from-[#fff3e6] to-[#ffe0cf] flex items-center justify-center p-6">
              <div className="w-full aspect-[4/3] rounded-2xl bg-gradient-to-b from-[#ffe4c8] to-[#f3c29e]" />
            </div>
            <div className="md:w-1/2 p-6 flex flex-col justify-between">
              <div>
                <p className="text-[10px] tracking-[0.25em] text-[#b59a7d] mb-1">
                  YOU
                </p>
                <p className="text-lg font-serif mb-3">
                  ご本人様プロフィール
                </p>
                <p className="text-xs text-[#6b5646] leading-relaxed">
                  ダッシュボード側で「新郎・新婦プロフィール」テーブルを作成したら、
                  こちらに詳細な自己紹介・エピソードを表示できるようにします。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HISTORY */}
      <section
        id="history"
        className="max-w-4xl mx-auto mb-16 px-4"
      >
        <p className="text-[10px] tracking-[0.3em] text-center text-[#b59a7d] mb-1">
          新郎新婦のヒストリー
        </p>
        <h2 className="text-xl font-serif text-center tracking-[0.18em] mb-8">
          HISTORY
        </h2>

        <div className="relative border-l border-[#d9c7b4] ml-4 md:ml-1">
          {/* ここはまだダミー。あとで DB のヒストリーテーブルと連携予定 */}
          {[
            '出会い',
            'お付き合いスタート',
            'プロポーズ',
            'これから',
          ].map((label, idx) => (
            <div
              key={label}
              className="pl-6 pb-6 relative"
            >
              <div className="absolute -left-[9px] top-[6px] w-4 h-4 rounded-full bg-[#c4a27a]" />
              <p className="text-[11px] font-semibold text-[#4a3b32]">
                {label}
              </p>
              <p className="text-xs text-[#7a6454] mt-1 leading-relaxed">
                ヒストリーの詳細テキストは、後ほど
                「新郎ヒストリー / 新婦ヒストリー / 出会いのストーリー」
                入力ページと連携して差し替えます。（現在はプレビュー用のダミー文です）
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Q&A */}
      <section id="qa" className="max-w-4xl mx-auto mb-16 px-4">
        <p className="text-[10px] tracking-[0.3em] text-center text-[#b59a7d] mb-1">
          一問一答
        </p>
        <h2 className="text-xl font-serif text-center tracking-[0.18em] mb-8">
          QUESTION
        </h2>

        <div className="bg-white rounded-3xl shadow-sm px-6 py-6 md:px-10 md:py-8">
          <div className="grid md:grid-cols-3 gap-y-6 text-xs md:text-[11px] text-center">
            <div className="space-y-2">
              <p className="text-[10px] tracking-[0.2em] text-[#b59a7d]">
                YUDAI
              </p>
              <p className="font-semibold">お互いの第一印象は？</p>
              <p className="text-[#7a6454]">
                ここに Q&amp;A テーブルの回答を表示予定です。
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] tracking-[0.2em] text-[#b59a7d]">
                BOTH
              </p>
              <p className="font-semibold">相手の好きなところは？</p>
              <p className="text-[#7a6454]">
                後ほど DB と連携して、本番の回答に差し替えます。
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] tracking-[0.2em] text-[#b59a7d]">
                NATSU
              </p>
              <p className="font-semibold">一番思い出に残っているデートは？</p>
              <p className="text-[#7a6454]">
                ここもダッシュボードの入力から自動反映される想定です。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section
        id="gallery"
        className="max-w-4xl mx-auto mb-16 px-4"
      >
        <p className="text-[10px] tracking-[0.3em] text-center text-[#b59a7d] mb-1">
          写真集
        </p>
        <h2 className="text-xl font-serif text-center tracking-[0.18em] mb-8">
          GALLERY
        </h2>

        <div className="grid md:grid-cols-3 gap-3">
          <div className="md:row-span-2 rounded-3xl bg-gradient-to-b from-[#cbe8ff] to-[#88c267] aspect-[3/4]" />
          <div className="rounded-3xl bg-gradient-to-b from-[#cbe8ff] to-[#88c267] aspect-[4/3]" />
          <div className="rounded-3xl bg-gradient-to-b from-[#cbe8ff] to-[#88c267] aspect-[4/3]" />
        </div>
        <p className="mt-3 text-[10px] text-center text-[#7a6454]">
          本番では実際のお写真をアップロードして表示する予定です。
        </p>
      </section>

      {/* SUPPORT / WISHLIST */}
      <section
        id="support"
        className="max-w-4xl mx-auto mb-20 px-4"
      >
        <p className="text-[10px] tracking-[0.3em] text-center text-[#b59a7d] mb-1">
          ご祝儀・ウィッシュリスト
        </p>
        <h2 className="text-xlრაფ font-serif text-center tracking-[0.18em] mb-6">
          SUPPORT
        </h2>

        {items.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-sm px-5 py-4 flex justify-between gap-4"
              >
                <div>
                  <p className="text-sm font-semibold mb-1">
                    {item.name ?? 'ギフト'}
                  </p>
                  {item.description && (
                    <p className="text-xs text-[#7a6454] whitespace-pre-line">
                      {item.description}
                    </p>
                  )}
                </div>
                {typeof item.target_amount === 'number' && (
                  <p className="text-xs text-[#a06b3f] whitespace-nowrap">
                    目安 ¥{item.target_amount.toLocaleString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-center text-[#7a6454] mb-6">
            ほしいものリストはまだ登録されていません。ダッシュボードから追加するとここに表示されます。
          </p>
        )}

        <div className="flex justify-center">
          <button className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-[#cfa576] via-[#e2bf8d] to-[#cfa576] text-[11px] tracking-[0.2em] text-white shadow-md">
            <span className="text-sm">💌</span>
            応援する
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="pb-10 text-center text-[10px] text-[#a58c76]">
        <p>PREVIEW VERSION · MARIF</p>
        <Link
          href="/dashboard"
          className="mt-2 inline-block text-[10px] underline"
        >
          ダッシュボードへ戻る
        </Link>
      </footer>
    </main>
  );
}
