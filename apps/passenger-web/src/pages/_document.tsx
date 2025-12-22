import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="ar" dir='rtl'>
      <Head>
        <meta name="facebook-domain-verification" content="i33h9droweiek5s7g1bn1qhlbm2mov" />
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
