import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="ar" dir='rtl'>
      <Head>
        <title>يلا باص - السائق</title>
        <link rel="icon" href="/logo.jpeg" />
        <link rel="apple-touch-icon" href="/logo.jpeg" />
        <meta property="og:image" content="/logo.jpeg" />
        <link rel="preload" href="/fonts/Cairo-VariableFont_slnt,wght.ttf" as="font" type="font/ttf" />
        <link rel="preload" href="/fonts/NotoColorEmoji-Regular.ttf" as="font" type="font/ttf" />
      </Head>
      <body className='font-cairo'>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
