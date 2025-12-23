import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="ar" dir='rtl'>
      <Head>
        <link rel="icon" href="/logo.jpeg" />
        <link rel="apple-touch-icon" href="/logo.jpeg" />
        <meta name="facebook-domain-verification" content="i33h9droweiek5s7g1bn1qhlbm2mov" />
        <meta property="og:image" content="/logo.jpeg" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "يلا باص",
            "alternateName": "YallaBus",
            "url": "https://yallabus.app",
            "logo": "https://yallabus.app/logo.jpeg"
          })
        }} />
        <link rel="preload" href="/fonts/Cairo-VariableFont_slnt,wght.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://apis.google.com" />
        <link rel="preconnect" href="https://www.googleapis.com" />
        <link rel="dns-prefetch" href="https://firebaseapp.com" />
      </Head>
      <body className='font-cairo'>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
