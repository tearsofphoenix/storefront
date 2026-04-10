import { Metadata } from "next"
import { getI18n } from "@lib/i18n/server"

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getI18n()
  const isZhHant = locale === "zh-Hant"

  return {
    title: isZhHant ? "隱私權政策" : "Privacy Policy",
    description: isZhHant
      ? "當您造訪或在 Panda AI Store 購物時，我們如何收集、使用與分享您的個人資訊。"
      : "How your personal information is collected, used, and shared when you visit or purchase from Panda AI Store.",
  }
}

export default async function PrivacyPolicyPage() {
  const { locale } = await getI18n()
  const isZhHant = locale === "zh-Hant"

  return (
    <div className="py-12 flex flex-col items-start justify-start min-h-[calc(100vh-64px)] content-container max-w-3xl mx-auto">
      <h1 className="text-3xl-semi text-ui-fg-base mb-8">{isZhHant ? "隱私權政策" : "Privacy Policy"}</h1>

      <div className="text-base-regular text-ui-fg-subtle text-left w-full space-y-8">
        {isZhHant ? (
          <>
            <section className="space-y-4">
              <p>
                本隱私權政策描述了當您造訪或在 store.pandacat.ai（以下簡稱「本網站」）購物時，我們如何收集、使用和分享您的個人資訊。
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-lg-semi text-ui-fg-base">我們收集的個人資訊</h2>
              <p>
                當您造訪本網站時，我們會自動收集有關您裝置的某些資訊，包括您的網頁瀏覽器資訊、IP 位址、時區以及您裝置上安裝的部分 Cookie。此外，當您瀏覽本網站時，我們會收集您查看的網頁或產品、將您引導至本網站的網站或搜尋字詞，以及您與本網站互動方式的資訊。我們將這些自動收集的資訊稱為「設備資訊」。
              </p>
              <p>我們使用以下技術收集設備資訊：</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  「Cookie」是放置在您的裝置或電腦上的資料文件，通常包含一個匿名的唯一識別碼。有關 Cookie 的更多資訊以及如何停用 Cookie，請造訪{" "}
                  <a href="http://www.allaboutcookies.org" className="underline">
                    http://www.allaboutcookies.org
                  </a>
                  。
                </li>
                <li>
                  「記錄檔」會追蹤您在網站上的操作，並收集包含您的 IP 位址、瀏覽器類型、網路服務供應商、來源/離站頁面以及日期/時間戳記在內的資料。
                </li>
                <li>
                  「網路信標」、「標籤」和「像素」是用來記錄您瀏覽網站方式的電子檔案。
                </li>
              </ul>
              <p>
                此外，當您透過網站購買或嘗試購買時，我們會收集您的某些資訊，包括您的姓名、帳單地址、收貨地址、付款資訊（包括信用卡號）、電子郵件地址和電話號碼。我們將這些資訊稱為「訂單資訊」。
              </p>
              <p>
                在本隱私權政策中，當我們提及「個人資訊」時，我們指的是設備資訊和訂單資訊。
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-lg-semi text-ui-fg-base">我們如何使用您的個人資訊？</h2>
              <p>
                我們通常使用收集到的訂單資訊來處理透過網站下的任何訂單（包括處理您的付款資訊、安排出貨以及向您提供發票和/或訂單確認）。此外，我們也會使用訂單資訊來：
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>與您溝通；</li>
                <li>篩選訂單是否有潛在風險或詐欺；以及</li>
                <li>在符合您與我們分享的偏好時，向您提供與我們產品或服務相關的資訊或廣告。</li>
              </ul>
              <p>
                我們使用收集到的設備資訊來幫助我們篩選潛在風險和詐欺（特別是您的 IP 位址），更廣泛地來說，是為了改善和優化我們的網站（例如，透過分析客戶如何瀏覽和使用網站，以及評估我們行銷和廣告活動的成效）。
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-lg-semi text-ui-fg-base">分享您的個人資訊</h2>
              <p>
                我們會與第三方分享您的個人資訊，以協助我們以上述方式使用您的個人資訊。例如，我們使用 WooCommerce 來經營我們的線上商店，您可以在{" "}
                <a href="https://automattic.com/privacy" className="underline">
                  https://automattic.com/privacy
                </a>{" "}
                閱讀 WooCommerce 如何使用您的個人資訊。我們也使用 Google Analytics 來幫助我們了解客戶如何使用本網站，您可以在{" "}
                <a
                  href="https://www.google.com/intl/en/policies/privacy/"
                  className="underline"
                >
                  https://www.google.com/intl/en/policies/privacy/
                </a>{" "}
                閱讀 Google 如何使用您的個人資訊；您也可以在{" "}
                <a href="https://tools.google.com/dlpage/gaoptout" className="underline">
                  https://tools.google.com/dlpage/gaoptout
                </a>{" "}
                選擇退出 Google Analytics。
              </p>
              <p>
                最後，我們也可能會分享您的個人資訊，以遵守適用的法律法規、回應我們收到的傳票、搜索令或其他合法的資訊請求，或以其他方式保護我們的權利。
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-lg-semi text-ui-fg-base">行為廣告</h2>
              <p>
                如上所述，我們會使用您的個人資訊向您提供我們認為您可能感興趣的定向廣告或行銷訊息。如需了解更多關於定向廣告運作方式，您可以造訪 Network Advertising Initiative（NAI）的說明頁面：
                <a
                  href="http://www.networkadvertising.org/understanding-online-advertising/how-does-it-work"
                  className="underline"
                >
                  {" "}
                  http://www.networkadvertising.org/understanding-online-advertising/how-does-it-work
                </a>
                。
              </p>
              <p>您可以透過以下連結選擇退出定向廣告：</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Facebook:{" "}
                  <a href="https://www.facebook.com/settings/?tab=ads" className="underline">
                    https://www.facebook.com/settings/?tab=ads
                  </a>
                </li>
                <li>
                  Google:{" "}
                  <a href="https://www.google.com/settings/ads/anonymous" className="underline">
                    https://www.google.com/settings/ads/anonymous
                  </a>
                </li>
                <li>
                  Bing:{" "}
                  <a
                    href="https://advertise.bingads.microsoft.com/en-us/resources/policies/personalized-ads"
                    className="underline"
                  >
                    https://advertise.bingads.microsoft.com/en-us/resources/policies/personalized-ads
                  </a>
                </li>
              </ul>
              <p>
                此外，您還可以造訪 Digital Advertising Alliance 的退出入口網站{" "}
                <a href="http://optout.aboutads.info/" className="underline">
                  http://optout.aboutads.info/
                </a>{" "}
                以選擇退出部分此類服務。
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-lg-semi text-ui-fg-base">請勿追蹤</h2>
              <p>
                請注意，即使您的瀏覽器發出「請勿追蹤」訊號，我們也不會因此更改本網站的資料收集與使用方式。
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-lg-semi text-ui-fg-base">您的權利</h2>
              <p>
                如果您是歐洲居民，您有權存取我們持有的您的個人資訊，並要求更正、更新或刪除您的個人資訊。如果您想行使此權利，請透過以下聯絡方式與我們聯絡。
              </p>
              <p>
                此外，如果您是歐洲居民，我們在此說明，我們處理您的資訊是為了履行我們可能與您簽訂的合約（例如您透過本網站下單），或基於上述合法商業利益。另請注意，您的資訊可能會被傳輸至歐洲以外地區，包括加拿大與美國。
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-lg-semi text-ui-fg-base">資料保存</h2>
              <p>
                當您透過本網站下單後，除非您要求我們刪除此資訊，否則我們將保留您的訂單資訊作為記錄。
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-lg-semi text-ui-fg-base">變更</h2>
              <p>
                我們可能會不定期更新本隱私權政策，以反映例如我們實務上的變更，或其他營運、法律或監管原因。
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-lg-semi text-ui-fg-base">聯絡我們</h2>
              <p>
                如果您想進一步了解我們的隱私實務、有任何疑問，或希望提出申訴，請透過電子郵件聯絡我們：
                <a href="mailto:support@pandacat.ai" className="underline">
                  {" "}
                  support@pandacat.ai
                </a>
                。
              </p>
            </section>
          </>
        ) : (
          <>
            <section className="space-y-4">
              <p>
                This Privacy Policy describes how your personal information is collected, used, and
                shared when you visit or make a purchase from store.pandacat.ai (the
                &quot;Site&quot;).
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-lg-semi text-ui-fg-base">PERSONAL INFORMATION WE COLLECT</h2>
              <p>
                When you visit the Site, we automatically collect certain information about your
                device, including information about your web browser, IP address, time zone, and
                some of the cookies that are installed on your device. Additionally, as you browse
                the Site, we collect information about the individual web pages or products that
                you view, what websites or search terms referred you to the Site, and information
                about how you interact with the Site. We refer to this automatically-collected
                information as &quot;Device Information&quot;.
              </p>
              <p>We collect Device Information using the following technologies:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  &quot;Cookies&quot; are data files that are placed on your device or computer and
                  often include an anonymous unique identifier. For more information about cookies,
                  and how to disable cookies, visit{" "}
                  <a href="http://www.allaboutcookies.org" className="underline">
                    http://www.allaboutcookies.org
                  </a>
                  .
                </li>
                <li>
                  &quot;Log files&quot; track actions occurring on the Site, and collect data
                  including your IP address, browser type, Internet service provider,
                  referring/exit pages, and date/time stamps.
                </li>
                <li>
                  &quot;Web beacons&quot;, &quot;tags&quot;, and &quot;pixels&quot; are electronic
                  files used to record information about how you browse the Site.
                </li>
              </ul>
              <p>
                Additionally, when you make a purchase or attempt to make a purchase through the
                Site, we collect certain information from you, including your name, billing
                address, shipping address, payment information (including credit card numbers),
                email address, and phone number. We refer to this information as &quot;Order
                Information&quot;.
              </p>
              <p>
                When we talk about &quot;Personal Information&quot; in this Privacy Policy, we are
                talking both about Device Information and Order Information.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-lg-semi text-ui-fg-base">
                HOW DO WE USE YOUR PERSONAL INFORMATION?
              </h2>
              <p>
                We use the Order Information that we collect generally to fulfill any orders placed
                through the Site (including processing your payment information, arranging for
                shipping, and providing you with invoices and/or order confirmations). Additionally,
                we use this Order Information to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Communicate with you;</li>
                <li>Screen our orders for potential risk or fraud; and</li>
                <li>
                  When in line with the preferences you have shared with us, provide you with
                  information or advertising relating to our products or services.
                </li>
              </ul>
              <p>
                We use the Device Information that we collect to help us screen for potential risk
                and fraud (in particular, your IP address), and more generally to improve and
                optimize our Site (for example, by generating analytics about how our customers
                browse and interact with the Site, and to assess the success of our marketing and
                advertising campaigns).
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-lg-semi text-ui-fg-base">SHARING YOUR PERSONAL INFORMATION</h2>
              <p>
                We share your Personal Information with third parties to help us use your Personal
                Information, as described above. For example, we use WooCommerce to power our
                online store. You can read more about how WooCommerce uses your Personal
                Information here:{" "}
                <a href="https://automattic.com/privacy" className="underline">
                  https://automattic.com/privacy
                </a>
                . We also use Google Analytics to help us understand how our customers use the
                Site. You can read more about how Google uses your Personal Information here:{" "}
                <a href="https://www.google.com/intl/en/policies/privacy/" className="underline">
                  https://www.google.com/intl/en/policies/privacy/
                </a>
                . You can also opt-out of Google Analytics here:{" "}
                <a href="https://tools.google.com/dlpage/gaoptout" className="underline">
                  https://tools.google.com/dlpage/gaoptout
                </a>
                .
              </p>
              <p>
                Finally, we may also share your Personal Information to comply with applicable laws
                and regulations, to respond to a subpoena, search warrant, or other lawful requests
                for information we receive, or to otherwise protect our rights.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-lg-semi text-ui-fg-base">BEHAVIORAL ADVERTISING</h2>
              <p>
                As described above, we use your Personal Information to provide you with targeted
                advertisements or marketing communications we believe may be of interest to you. For
                more information about how targeted advertising works, you can visit the Network
                Advertising Initiative&apos;s (NAI) educational page at{" "}
                <a
                  href="http://www.networkadvertising.org/understanding-online-advertising/how-does-it-work"
                  className="underline"
                >
                  http://www.networkadvertising.org/understanding-online-advertising/how-does-it-work
                </a>
                .
              </p>
              <p>You can opt-out of targeted advertising by using the links below:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Facebook:{" "}
                  <a href="https://www.facebook.com/settings/?tab=ads" className="underline">
                    https://www.facebook.com/settings/?tab=ads
                  </a>
                </li>
                <li>
                  Google:{" "}
                  <a href="https://www.google.com/settings/ads/anonymous" className="underline">
                    https://www.google.com/settings/ads/anonymous
                  </a>
                </li>
                <li>
                  Bing:{" "}
                  <a
                    href="https://advertise.bingads.microsoft.com/en-us/resources/policies/personalized-ads"
                    className="underline"
                  >
                    https://advertise.bingads.microsoft.com/en-us/resources/policies/personalized-ads
                  </a>
                </li>
              </ul>
              <p>
                Additionally, you can opt-out of some of these services by visiting the Digital
                Advertising Alliance&apos;s opt-out portal at{" "}
                <a href="http://optout.aboutads.info/" className="underline">
                  http://optout.aboutads.info/
                </a>
                .
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-lg-semi text-ui-fg-base">DO NOT TRACK</h2>
              <p>
                Please note that we do not alter the Site&apos;s data collection and use practices
                when we see a Do Not Track signal from your browser.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-lg-semi text-ui-fg-base">YOUR RIGHTS</h2>
              <p>
                If you are a European resident, you have the right to access personal information
                we hold about you and to ask that your personal information be corrected, updated,
                or deleted. If you would like to exercise this right, please contact us through the
                contact information below.
              </p>
              <p>
                Additionally, if you are a European resident, we note that we are processing your
                information in order to fulfill contracts we might have with you (for example if
                you make an order through the Site), or otherwise to pursue our legitimate business
                interests listed above. Please also note that your information will be transferred
                outside of Europe, including to Canada and the United States.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-lg-semi text-ui-fg-base">DATA RETENTION</h2>
              <p>
                When you place an order through the Site, we will maintain your Order Information
                for our records unless and until you ask us to delete this information.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-lg-semi text-ui-fg-base">CHANGES</h2>
              <p>
                We may update this privacy policy from time to time in order to reflect, for
                example, changes to our practices or for other operational, legal, or regulatory
                reasons.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-lg-semi text-ui-fg-base">CONTACT</h2>
              <p>
                For more information about our privacy practices, if you have questions, or if you
                would like to make a complaint, please contact us by email at{" "}
                <a href="mailto:support@pandacat.ai" className="underline">
                  support@pandacat.ai
                </a>
                .
              </p>
            </section>
          </>
        )}
      </div>
    </div>
  )
}
