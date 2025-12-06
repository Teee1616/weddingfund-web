// web/app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

type GiftList = {
  id: string;
  title: string | null;
  description: string | null;
};

type CoupleProfile = {
  id: string;
  partner_name: string | null;       // 例: 新郎 or パートナー名
  partner_email: string | null;
  wedding_status: string | null;
  wedding_date: string | null;       // date 型を string で受ける
  message_to_guests: string | null;  // 挨拶文
};

export default function DashboardPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [displayName, setDisplayName] = useState<string | null>(null);
  const [couple, setCouple] = useState<CoupleProfile | null>(null);
  const [giftList, setGiftList] = useState<GiftList | null>(null);
  const [giftItemCount, setGiftItemCount] = useState<number>(0);

  // 将来 Stripe 連携したあとにここで支援状況を埋める
  const [totalSupportAmount, setTotalSupportAmount] = useState<number>(0);
  const [supporterCount, setSupporterCount] = useState<number>(0);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErrorMsg(null);

      // 1) ログインユーザー確認
      const { data: userData, error: getUserError } =
        await supabase.auth.getUser();

      if (getUserError || !userData.user) {
        router.push('/login');
        return;
      }
      const authUser = userData.user;

      // 2) app users
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

      setDisplayName(
        appUser.display_name ?? (appUser.email as string) ?? 'ゲスト'
      );

      // 3) couple_profiles （1ユーザー1件想定）
      const { data: coupleProfile, error: coupleError } = await supabase
        .from('couple_profiles')
        .select(
          'id, partner_name, partner_email, wedding_status, wedding_date, message_to_guests'
        )
        .eq('user_id', appUser.id)
        .single();

      if (coupleError || !coupleProfile) {
        console.error(coupleError);
        setErrorMsg(
          'カップルプロフィールが見つかりません。サインアップ処理を確認してください。'
        );
        setLoading(false);
        return;
      }

      setCouple(coupleProfile as CoupleProfile);

      // 4) gift_lists（とりあえず最初の1件を「メインページ」とみなす）
      const { data: lists, error: listsError } = await supabase
        .from('gift_lists')
        .select('id, title, description')
        .eq('couple_id', coupleProfile.id)
        .order('created_at', { ascending: true });

      if (listsError) {
        console.error(listsError);
        setErrorMsg('ギフトリストの取得に失敗しました。');
        setLoading(false);
        return;
      }

      const mainList = (lists && lists[0]) || null;
      setGiftList(mainList);

      // 5) メインリストに紐づくアイテム数
      if (mainList) {
        const { count, error: itemsError } = await supabase
          .from('gift_items')
          .select('id', { count: 'exact', head: true })
          .eq('gift_list_id', mainList.id);

        if (itemsError) {
          console.error(itemsError);
        } else if (typeof count === 'number') {
          setGiftItemCount(count);
        }
      }

      // 6) 支援状況（TODO: Stripe & contributions 連携）
      // いまは 0 のまま。後で contributions テーブルから集計する。

      setLoading(false);
    };

    load();
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-600">読み込み中…</p>
      </main>
    );
  }

  if (errorMsg) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white shadow-md rounded-xl p-6 max-w-md w-full">
          <p className="text-sm text-red-600 whitespace-pre-line">
            {errorMsg}
          </p>
        </div>
      </main>
    );
  }

  // 進捗計算（ざっくり）
  const templateDone = !!giftList; // とりあえずリスト作成済み = テンプレ完了扱い
  const greetingDone = !!couple?.message_to_guests;
  const profileDone = !!couple?.wedding_status || !!couple?.wedding_date;
  const wishlistDone = giftItemCount > 0;

  const requiredTotal = 4;
  const requiredDone =
    Number(templateDone) +
    Number(greetingDone) +
    Number(profileDone) +
    Number(wishlistDone);
  const progressPercent = Math.round((requiredDone / requiredTotal) * 100);

  return (
    <main className="min-h-screen bg-[#f5f2ec]">
      <div className="max-w-5xl mx-auto py-10 px-4 flex gap-6">
        {/* 左サイドバー */}
        <aside className="w-64 bg-white rounded-2xl shadow-md p-5 flex flex-col gap-6">
          <div>
            <p className="text-xs text-slate-500 mb-1">お名前</p>
            <p className="text-sm font-semibold">
              {displayName ?? 'ゲスト'}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500 mb-1">管理メニュー</p>
            <ul className="space-y-1 text-xs">
              <li>
                <button
                  className="text-blue-600 underline"
                  onClick={() => router.push('/gift-lists/new')}
                >
                  新しいご祝儀ページを作成
                </button>
              </li>
              {giftList && (
                <li>
                  <button
                    className="text-blue-600 underline"
                    onClick={() => router.push(`/gift-lists/${giftList.id}`)}
                  >
                    ほしいものリストの編集
                  </button>
                </li>
              )}
            </ul>
          </div>

          <button
            className="mt-auto text-xs text-slate-500 underline"
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.href = '/login';
            }}
          >
            ログアウト
          </button>
        </aside>

        {/* メインエリア */}
        <section className="flex-1 space-y-6">
          {/* あいさつセクション */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <p className="text-xs text-slate-500 mb-2">
              ご登録ありがとうございます。新生活のおひろめやマリフの使い方をご案内します。
            </p>
            
            <h1 className="text-xl font-bold mb-4">
              {displayName ?? 'ご夫婦'} 様、はじめまして！
            </h1>

            <ol className="space-y-3 text-sm">
              <li>
                <p className="font-semibold mb-1">
                  ① 新郎新婦様のお名前・基本情報
                </p>
                <p className="text-xs text-slate-600 mb-1">
                  ご紹介ページに表示するお名前や挙式予定日などを登録します。
                </p>
                <button
                  className="mt-1 text-xs bg-black text-white rounded px-3 py-1"
                  onClick={() => router.push('/profile/edit')}
                >
                  作成する（プロフィール）
                </button>
              </li>
              <li>
                <p className="font-semibold mb-1">② 挨拶文の作成</p>
                <p className="text-xs text-slate-600 mb-1">
                  ゲストの皆さまへのメッセージを登録します。
                </p>
                <button
                  className="mt-1 text-xs bg-black text-white rounded px-3 py-1"
                  onClick={() => router.push('/greeting/edit')}
                >
                  作成する（挨拶文）
                </button>
              </li>
              <li>
                <p className="font-semibold mb-1">③ ほしいものリスト</p>
                <p className="text-xs text-slate-600 mb-1">
                  ご祝儀としていただいたご支援を、どのようなギフトに充てるかまとめます。
                </p>
                <button
                  className="mt-1 text-xs bg-black text-white rounded px-3 py-1"
                  onClick={() =>
                    giftList
                      ? router.push(`/gift-lists/${giftList.id}`)
                      : router.push('/gift-lists/new')
                  }
                >
                  {giftList ? 'リストを編集する' : 'リストを作成する'}
                </button>
              </li>
            </ol>
          </div>

          {/* ご祝儀ページ作成ステップ */}
          <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
            <h2 className="text-sm font-semibold mb-2">ご祝儀ページ作成</h2>

            {/* 進捗バー */}
            <div className="mb-4">
              <p className="text-xs text-slate-600 mb-1">
                進捗状況：{requiredDone}/{requiredTotal} 件 完了
              </p>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#c49a6c]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* 必須項目 */}
            <div className="space-y-2 text-xs">
              <SectionRow
                label="テンプレート選択"
                done={templateDone}
                onClick={() =>
                  giftList
                    ? router.push(`/gift-lists/${giftList.id}`)
                    : router.push('/gift-lists/new')
                }
              />
              <SectionRow
                label="挨拶文"
                done={greetingDone}
                onClick={() => router.push('/greeting/edit')}
              />
              <SectionRow
                label="新郎新婦プロフィール"
                done={profileDone}
                onClick={() => router.push('/profile/edit')}
              />
              <SectionRow
                label="ほしいものリスト"
                done={wishlistDone}
                onClick={() =>
                  giftList
                    ? router.push(`/gift-lists/${giftList.id}`)
                    : router.push('/gift-lists/new')
                }
              />
            </div>

            {/* 任意項目の例（まだ中身はこれから） */}
            <div className="mt-4">
              <p className="text-xs text-slate-500 mb-1">
                任意項目（登録がなくてもページ公開はできます）
              </p>
              <div className="space-y-1 text-xs">
                <SectionRow
                  label="お二人のストーリー"
                  done={false}
                  onClick={() => router.push('/story/edit')}
                />
                <SectionRow
                  label="思い出写真"
                  done={false}
                  onClick={() => router.push('/photos/edit')}
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                className="flex-1 border border-slate-300 text-xs rounded-full py-2"
                onClick={() =>
                  giftList
                    ? router.push(`/p/preview/${giftList.id}`)
                    : undefined
                }
                disabled={!giftList}
              >
                ページのプレビュー
              </button>
              <button
                className="flex-1 bg-[#c49a6c] text-white text-xs rounded-full py-2 disabled:opacity-60"
                disabled={!giftList || requiredDone < requiredTotal}
                onClick={() => {
                  // TODO: 公開フラグを立てる / public_url_tokens 発行に繋げる
                  alert('公開処理はこれから実装します。');
                }}
              >
                ページを作成する
              </button>
            </div>
          </div>

          {/* 支援状況（今はダミー） */}
          <div className="bg-white rounded-2xl shadow-md p-6 space-y-2">
            <h2 className="text-sm font-semibold mb-2">支援状況</h2>
            <p className="text-xs text-slate-600">
              Stripe 連携と contributions テーブルが整ったら、ここに
              「集まったご祝儀の合計金額」と「支援者数」を表示します。
            </p>
            <p className="text-sm mt-2">
              現在のご支援合計：¥{totalSupportAmount.toLocaleString()}
            </p>
            <p className="text-sm">
              支援者数：{supporterCount.toLocaleString()} 名
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

type SectionRowProps = {
  label: string;
  done: boolean;
  onClick: () => void;
};

function SectionRow({ label, done, onClick }: SectionRowProps) {
  return (
    <div className="flex items-center justify-between bg-slate-50 rounded-xl px-3 py-2">
      <div className="flex items-center gap-2">
        <span
          className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
            done
              ? 'bg-[#c49a6c] border-[#c49a6c] text-white'
              : 'border-slate-300 text-slate-400'
          }`}
        >
          {done ? '✓' : ''}
        </span>
        <span className="text-xs">{label}</span>
      </div>
      <button
        className="text-[11px] bg-white border border-slate-300 rounded-full px-3 py-1"
        onClick={onClick}
      >
        作成する
      </button>
    </div>
  );
}
