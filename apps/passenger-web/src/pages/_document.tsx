import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="ar" dir='rtl'>
      <Head>
        <title>مشواري</title>
        <meta name="facebook-domain-verification" content="i33h9droweiek5s7g1bn1qhlbm2mov" />
      </Head>
      <body className='font-cairo'>
        <span className='noto-color-emoji' style={{ position: 'absolute', visibility: 'hidden', pointerEvents: 'none' }}>🇸🇦🇾🇪🇪🇬</span>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
