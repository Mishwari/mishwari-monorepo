import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="ar" dir='rtl'>
      <Head>
        <title>مشواري - السائق</title>
      </Head>
      <body className='font-cairo'>
        <span className='noto-color-emoji' style={{ position: 'absolute', visibility: 'hidden', pointerEvents: 'none' }}>🇸🇦🇾🇪🇪🇬</span>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
