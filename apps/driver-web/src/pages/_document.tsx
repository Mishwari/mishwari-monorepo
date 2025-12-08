import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="ar" dir='rtl'>
      <Head>
        <title>يلا باص - السائق</title>
        <link rel="preload" href="/fonts/Cairo-VariableFont_slnt,wght.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/NotoColorEmoji-Regular.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
      </Head>
      <body className='font-cairo'>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
