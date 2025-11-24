import Image from 'next/image';

export default function HomePage() {
  return (
    <main className="min-h-screen text-[#6b3d33] font-['Noto_Serif_JP']">
      {/* 背景レイヤー */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/hero-fabric.jpg"
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#f4ece4]/60" />
      </div>

      {/* 固定ナビ */}
      <header
        className="
        sticky top-0 z-20 
        bg-[#f4ece4]/85 backdrop-blur-md 
        border-b border-[#d9c7bc]
      "
      >
        <div className="max-w-5xl mx-auto flex justify-between items-center px-6 py-3">
          <div className="text-xl font-bold tracking-wide text-[#6b3d33]">
            MARIF
          </div>

          <nav className="flex items-center gap-4 text-sm">
            <a
              href="#about"
              className="px-4 py-2 rounded-full bg-white/90 text-[#6b3d33] border border-[#6b3d33]/40 hover:bg-white"
            >
              Marifについて
            </a>
            <a
              href="/sign-up"
              className="px-4 py-2 rounded-full bg-[#6b3d33] text-white hover:bg-[#5a3029]"
            >
              ふたりのご祝儀ページを作る
            </a>
          </nav>
        </div>
      </header>

      {/* HERO セクション */}
      <section className="max-w-5xl mx-auto px-6 py-20 md:py-28">
        <p className="text-base md:text-lg text-[#8b5a4a] leading-relaxed mb-8 font-medium tracking-wide">
          ご祝儀のカタチを変える、新世代のご祝儀プラットフォーム
        </p>

        <h1 className="text-4xl md:text-6xl font-bold leading-relaxed text-[#6b3d33] mb-6">
          結婚式がなくても、
          <br />
          祝福は届けられる。
        </h1>

        <p className="text-base md:text-lg text-[#8b5a4a] leading-relaxed mb-8 font-medium tracking-wide">
           ほしい物を選び、リンクを共有するだけ。
            <br />
            結婚準備からご祝儀のやりとりを、もっとシンプルでスマートに。
        </p>


        <a
          href="/sign-up"
          className="inline-block rounded-full bg-white/90 px-6 py-3 text-sm font-semibold text-[#6b3d33] border border-[#6b3d33]/30 hover:bg-white shadow-sm"
        >
          ふたりのご祝儀ページを作る
        </a>
      </section>

      {/* 1. 課題イメージ（今の About セクション） */}
      <section
        id="about"
        className="max-w-5xl mx-auto px-6 py-20 bg-[#fdf9f6]/90 rounded-2xl shadow-sm mb-16"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-[#6b3d33] text-center mb-10 leading-relaxed">
          どんなかたちの結婚でも、どんな距離にいても、
          <br />
          必要な祝福を、必要な人へ。
          <br />
          Marifがスマートにつなぎます。
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-[#6b3d33]">
          <p className="text-sm md:text-base leading-relaxed">
            新生活を始めるための資金は、
            多くの新婚夫婦が感じる課題です。
            結婚式を挙げない場合、引っ越しや家具・家電の準備まで
            すべて自己負担になってしまうことも少なくありません。
          </p>

          <ul className="text-sm md:text-base leading-relaxed space-y-2">
            <li>・引っ越し … 40万円以上</li>
            <li>・家具の買い替え … 10万円以上</li>
            <li>・家電の買い替え … 20万円以上</li>
            <li>・結婚式なしではご祝儀なし → すべて自己負担</li>
          </ul>
        </div>
      </section>

      {/* 2. とはいえ…＋Marifなら… セクション */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="bg-[#fdf9f6]/95 rounded-2xl shadow-sm px-6 md:px-10 py-10">
          <p className="text-center text-sm md:text-base text-[#8b5a4a] leading-relaxed mb-8">
            とはいえ、式を挙げない場合、
            ご祝儀として現金や物品を直接お願いするのは、
            どうしても気が引けてしまうもの。
          </p>

          <div className="grid grid-cols-1 md:grid-cols-[1.1fr,1fr] gap-8 items-center">
            {/* 左：写真っぽいボックス（あとで画像に差し替えOK） */}
            <div className="w-full aspect-[4/3] bg-[#d9c7bc] rounded-2xl overflow-hidden flex items-center justify-center text-xs text-[#6b3d33]/80">
              {/* ここを <Image> に差し替えてもOK */}
              写真イメージ（あとで差し替え）
            </div>

            {/* 右：テキスト */}
            <div className="space-y-4 text-sm md:text-base leading-relaxed">
              <p className="font-bold text-lg md:text-xl">
                Marifなら、
                <br />
                結婚報告と共に
                <br />
                ほしいものを
                <br />
                気軽く共有するだけ。
              </p>
              <p>
                祝福したい人は、リストの中から
                自由な金額でサポートができます。
                現金を「ちょうだい」とお願いするのではなく、
                「新生活のこれを一緒に準備してほしい」と
                具体的にイメージを共有できるのがポイントです。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. サービス内容のご紹介 */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="bg-[#fdf9f6]/95 rounded-2xl shadow-sm px-6 md:px-10 py-10 space-y-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            サービス内容のご紹介
          </h2>

          {/* 1. ご祝儀ページの作成 */}
          <div className="bg-white/90 rounded-2xl px-5 md:px-8 py-7 space-y-4">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#c79a7f] text-white text-sm font-semibold mb-2">
              1．ご祝儀ページの作成
            </div>

            <div className="space-y-4 text-sm md:text-base leading-relaxed">
              <div>
                <p className="font-semibold mb-1">① 簡易結婚報告ページ</p>
                <p>
                  結婚日時・新郎新婦のご紹介・二人のストーリーやプチ写真集など、
                  結婚式を挙げなくても結婚報告ができる機能をぎゅっと集約。
                  挨拶文と1行の夫婦紹介を書くところから、自由にカスタマイズできます。
                </p>
              </div>
              <div>
                <p className="font-semibold mb-1">② ウィッシュリストページ</p>
                <p>
                  新生活に必要な「もの」を選び、リスト化。
                  家電や家具、旅行費用など、ECサイトのURLをコピペして登録するだけでOK。
                  ゲストはそのリストを見ながら、応援したいアイテムに支援できます。
                </p>
              </div>
            </div>
          </div>

          {/* 2〜4の流れ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white/90 rounded-2xl px-5 md:px-7 py-6 space-y-3 text-sm md:text-base leading-relaxed">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#c79a7f] text-white text-sm font-semibold">
                2．共有リンクの発行・共有
              </div>
              <p>
                ワンクリックで「ご祝儀ページ」のURLを発行。
                LINE / Instagram / X など、SNSやメッセージアプリでそのままシェアできます。
              </p>
            </div>

            <div className="bg-white/90 rounded-2xl px-5 md:px-7 py-6 space-y-3 text-sm md:text-base leading-relaxed">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#c79a7f] text-white text-sm font-semibold">
                3．支援状況の確認
              </div>
              <p>
                今の支援状況をリアルタイムで確認。
                「今いくらくらい集まっているか」「どのアイテムに誰が支援してくれたか」を
                ダッシュボードで一覧できます。
              </p>
            </div>
          </div>

          <div className="bg-white/90 rounded-2xl px-5 md:px-8 py-6 space-y-3 text-sm md:text-base leading-relaxed">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#c79a7f] text-white text-sm font-semibold">
              4．ギフトの受け取り
            </div>
            <p>
              ご祝儀ページをクローズしたあとは、ご自宅へギフトを準備。
              金額が達成したアイテムはそのまま購入、
              足りない分はふたりで少し足して買う、といった柔軟な受け取りができます。
            </p>
          </div>
        </div>
      </section>

      {/* 4. Marifの特徴 */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="bg-[#fdf9f6]/95 rounded-2xl shadow-sm px-6 md:px-10 py-10">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Marifの特徴
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 特徴1 */}
            <div className="bg-white/90 rounded-2xl px-5 md:px-7 py-7 flex flex-col items-center text-center space-y-4">
              {/* アイコン枠（あとで画像に差し替えOK） */}
              <div className="w-28 h-28 rounded-full bg-[#d9e9b8] flex items-center justify-center text-xs text-[#6b3d33]/70">
                イラスト
              </div>
              <div className="space-y-2 text-sm md:text-base leading-relaxed">
                <p className="font-semibold">自由度の高いサポート</p>
                <p>
                  新生活に必要な「もの」の購入を、ちょろっとサポートしてもらうだけ。
                  贈る側は「自分の金額を指定して支援」でき、
                  現金というより「ものに結びついた祝福」として受け取れます。
                </p>
              </div>
            </div>

            {/* 特徴2 */}
            <div className="bg-white/90 rounded-2xl px-5 md:px-7 py-7 flex flex-col items-center text-center space-y-4">
              <div className="w-28 h-28 rounded-full bg-[#bfe0ff] flex items-center justify-center text-xs text-[#6b3d33]/70">
                イラスト
              </div>
              <div className="space-y-2 text-sm md:text-base leading-relaxed">
                <p className="font-semibold">安心できるセキュリティ</p>
                <p>
                  決済プロバイダー（Stripe）の仕組みを利用し、
                  集まったご祝儀は手数料を除き、100％新婚夫婦側に届けられます。
                  Marif自体はカード情報を持たない設計なので安心です。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. クロージング & CTA */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="bg-[#fdf9f6]/95 rounded-2xl shadow-sm px-6 md:px-10 py-10 space-y-8">
          <div className="text-center space-y-4">
            <p className="text-sm md:text-base">
              これまでに xxxxx 組のカップルが Marif と共に
              新しいご祝儀文化を作り上げています。
            </p>
            <p className="text-xl md:text-2xl font-bold">
              Marif であなたの結婚へ、祝福を！
            </p>
            <a
              href="/sign-up"
              className="inline-block rounded-full bg-[#6b3d33] px-6 py-3 text-sm font-semibold text-white hover:bg-[#5a3029]"
            >
              ふたりのご祝儀ページを作る →
            </a>
          </div>

          {/* SNS アイコン風（とりあえずテキスト） */}
          <div className="flex justify-center gap-5 text-xs text-[#6b3d33]/80">
            <span>Instagram</span>
            <span>X</span>
            <span>Facebook</span>
          </div>

          <div className="space-y-4 text-sm md:text-base">
            {/* 行1 */}
            <div className="flex flex-col md:flex-row items-stretch gap-3">
              <div className="flex-1 flex items-center gap-3 bg-white/90 rounded-2xl px-5 py-4">
                <div className="px-4 py-2 rounded-full bg-[#8b5a4a] text-white text-sm">
                  アイコン
                </div>
                <div className="space-y-1">
                  <p className="font-semibold">
                    具体的な流れが気になりますか？
                  </p>
                  <p className="text-xs md:text-sm text-[#8b5a4a]">
                    Marif のガイドを見て、イメージを確認してみてください。
                  </p>
                </div>
              </div>
              <a
                href="#"
                className="md:w-40 shrink-0 text-center rounded-2xl bg-[#6b3d33] text-white px-4 py-4 text-sm font-semibold flex items-center justify-center"
              >
                ガイドを見る
              </a>
            </div>

            {/* 行2 */}
            <div className="flex flex-col md:flex-row items-stretch gap-3">
              <div className="flex-1 flex items-center gap-3 bg-white/90 rounded-2xl px-5 py-4">
                <div className="px-4 py-2 rounded-full bg-[#8b5a4a] text-white text-sm">
                  アイコン
                </div>
                <div className="space-y-1">
                  <p className="font-semibold">
                    利用料金が気になりますか？
                  </p>
                  <p className="text-xs md:text-sm text-[#8b5a4a]">
                    Marif の利用料金は一律 XXX 円、
                    決済手数料 X% のみとなります。
                    ギフト購入に利用されなかったご祝儀は全額振込か返金を選択いただけます。
                  </p>
                </div>
              </div>
              <a
                href="#"
                className="md:w-40 shrink-0 text-center rounded-2xl bg-[#6b3d33] text-white px-4 py-4 text-sm font-semibold flex items-center justify-center"
              >
                料金の詳細を見る
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-[#8b5a4a]/80">
        © {new Date().getFullYear()} Marif / WeddingFund
      </footer>
    </main>
  );
}
