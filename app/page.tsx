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
        <div className="absolute inset-0 bg-[#f4ece4]/20" />
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
          <div className="text-xl md:text-2xl font-bold text-[#6b3d33] font-['Lovelo'] tracking-[0.2em]">
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

        <h1 className="text-4xl md:text-6xl font-bold leading-relaxed text-[#6b3d33] mb-6 font-['Lovelo'] tracking-[0.12em]">
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
<div className="bg-[#cfcac5] rounded-2xl p-6 md:p-10 shadow-sm max-w-4xl mx-auto">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center text-[#6b3d33]">

    {/* 左側：説明文（文字サイズUP） */}
    <p className="text-xl md:text-2xl font-bold leading-relaxed text-left md:mt-6">
      新生活を始めるための資金は、
      <br />
      多くの新婚夫婦が感じる課題です。
    </p>

    {/* 右側：白いBOXのリスト（行間を狭く＝space-y-2） */}
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <ul className="text-base md:text-lg leading-relaxed space-y-1 font-medium text-left">
        <li>・引っ越し　・・・　40万円以上</li>
        <li>・家具の買い替え　・・・　10万円以上</li>
        <li>・家電の買い替え　・・・　20万円以上</li>
        <li>・結婚式なしではご祝儀なし</li>
        <li className="text-center pt-1">
          <b className="text-[#6b3d33] text-lg">➡ すべて自己負担</b>
        </li>
      </ul>
    </div>

  </div>
</div>

      </section>

      {/* 2. とはいえ…＋Marifなら… セクション */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="bg-[#fdf9f6]/95 rounded-2xl shadow-sm px-6 md:px-10 py-12">
          {/* 上の説明文：行間を広めにして中央寄せ */}
          <p className="text-center text-lg md:text-xl text-[#8b5a4a] leading-relaxed mb-8 font-medium">
            とはいえ、式を挙げない場合、<br />
            ご祝儀として現金や物品を直接お願いするのは、<br />
            どうしても気が引けてしまうもの。
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center">
            {/* 左：写真（比率を少し縦長＆左寄せっぽく） */}
            <div className="w-full flex justify-center md:justify-start">
              <div className="w-full max-w-md rounded-3xl overflow-hidden shadow-lg">
                <Image
                  src="/wedding-couple.jpg"
                  alt="カップル写真"
                  width={800}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* 右：テキスト（参考画像に寄せてセンター寄せ気味のブロック） */}
            <div className="text-center md:text-left text-[#6b3d33]">
              <h2 className="text-2xl md:text-3xl font-bold leading-relaxed mb-6">
                Marifなら、<br />
                結婚報告と共に<br />
                ほしいものを<br />
                気軽く共有するだけ。
              </h2>

 <p className="space-y-1 leading-relaxed">
  祝福したい人は、リストの中から
  <br />

  {/* 強調したい部分「自由な金額」 */}
  <span className="inline-block relative font-semibold">
    自由な金額
    {/* アンダーライン */}
    <span className="block w-full h-[2px] bg-[#6b3d33] mt-1"></span>
  </span>

  {/* 通常フォントに戻す部分 */}
  <span>でサポートができます。</span>

  <br />
  現金を「ちょうだい」とお願いするのではなく、
  <br />
  「新生活のこれを一緒に準備してほしい」と
  <br />
  具体的にイメージを共有できるのがポイントです。
</p>
            </div>
          </div>
        </div>
      </section>


{/* 3. サービス内容のご紹介 */}
<section className="max-w-5xl mx-auto px-6 pb-20">
  <div className="bg-[#f3ede7] rounded-3xl px-4 md:px-6 py-10">
    <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
      サービス内容のご紹介
    </h2>

    {/* 1．ご祝儀ページの作成 */}
    <div className="relative mt-6 mb-8">
      <div className="bg-white rounded-[20px] shadow-lg shadow-black/10 border border-[#ead9cc] px-5 md:px-8 py-7">
        <div className="space-y-4 text-sm md:text-base leading-relaxed">
          <div>
            {/* ★ タイトルを大きく＋太字 */}
            <p className="font-bold mb-1 text-lg md:text-xl">
              ① 簡易結婚報告ページ
            </p>
            {/* ★ この本文を太字に */}
            <p className="font-semibold">
              　結婚日時・新郎新婦のご紹介・二人のストーリーやプチ写真集など、
              <br />
              　結婚式を挙げなくても結婚報告ができる機能をぎゅっと集約。
              <br />
              　挨拶文&1行の夫婦紹介を書くだけでもOK!
            </p>
            <p className="text-xs md:text-sm mt-1">
              　※ストーリーや写真集などは任意で設定可能
            </p>
          </div>

          <div>
            {/* ★ タイトルを大きく＋太字 */}
            <p className="font-bold mb-1 text-lg md:text-xl">
              ② ウィッシュリストページ
            </p>
            {/* ★ この本文を太字に */}
            <p className="font-semibold">
              　新生活に必要な「もの」を選び、リスト化する
              <br />
              　必要なものをECサイトから選んで、そのURLをコピー＆ペーストするだけでOK！
            </p>
          </div>
        </div>
      </div>

      <div className="absolute -top-5 left-6 inline-flex items-center px-5 py-2 rounded-full bg-[#c7a890] text-white text-sm md:text-base font-bold shadow">
  1．ご祝儀ページの作成
</div>

    </div>

    {/* 2・3 のボックス */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* 2．共有リンクの発行・共有 */}
      <div className="relative">
        <div className="bg-white rounded-[20px] shadow-lg shadow-black/10 border border-[#ead9cc] px-5 md:px-7 py-7 text-sm md:text-base leading-relaxed">
          {/* ★ この本文を太字に */}
  <p className="font-semibold">
  ワンクリックで「ご祝儀ページ」のURLを発行
  <br />
  共有リンクをSNSでシェアする
  <br />
  </p>
  <p className="text-xs md:text-sm mt-1 mb-1 block">
    LINE/Instagram/X など、SNSですぐ共有できる！
  </p>


        </div>
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 
  inline-flex items-center justify-center 
  px-5 py-2 rounded-full bg-[#c7a890] 
  text-white text-sm md:text-base font-bold shadow
  w-[270px]"
>
  2．共有リンクの発行・共有
</div>

      </div>

      {/* 3．支援状況の確認 */}
      <div className="relative">
        <div className="bg-white rounded-[20px] shadow-lg shadow-black/10 border border-[#ead9cc] px-5 md:px-7 py-7 text-sm md:text-base leading-relaxed">
          {/* ★ この本文を太字に */}
          <p className="font-semibold">
            今の支援状況をリアルタイムで確認
            <br />
            ・今いくらくらい集まっているか
            <br />
            ・どのアイテムに誰がサポートしてくれたのか
          </p>
        </div>
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 inline-flex items-center px-5 py-2 rounded-full bg-[#c7a890] text-white text-sm md:text-base font-bold shadow">
  3．支援状況の確認
</div>
      </div>
    </div>

{/* 4．ギフトの受け取り */}
<div className="relative">
  <div
    className="
      bg-white
      rounded-[28px]
      shadow-xl shadow-black/10
      border border-[#ead9cc]
      px-8 md:px-12
      py-12
      text-sm md:text-base
      leading-relaxed
      mx-auto
    "
  >
    <p className="font-semibold text-center">
      <span className="text-xl md:text-2xl mb-2 block">
        ご祝儀ページを閉じた後、ご自宅へギフトの発送
      </span>

      金額未達成のものに関しては、現金振り込みまたは新婚夫婦側で
      <br className="leading-[0.6]" />
      金額を足して購入することができる
    </p>
  </div>

  <div className="absolute -top-5 left-1/2 -translate-x-1/2 inline-flex items-center px-5 py-2 rounded-full bg-[#c7a890] text-white text-sm md:text-base font-bold shadow">
  4．ギフトの受け取り
</div>
</div>



  </div>
</section>

      {/* 4. Marifの特徴 */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="bg-[#fdf9f6]/95 rounded-3xl px-4 md:px-6 py-10">
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
