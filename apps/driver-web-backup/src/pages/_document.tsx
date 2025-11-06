import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en" dir='rtl'>
      <Head >
      {/* <link href="https://fonts.googleapis.com/css2?family=Cairo&display=swap" rel="stylesheet" /> */}

      </Head>
      <body className='font-cairo'>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
