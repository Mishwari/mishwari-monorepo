import '@mishwari/ui-web/styles/globals.css';
import { NextUIProvider } from '@nextui-org/react';
import type { AppProps } from 'next/app';
import { makeStore, AppState } from '@/store/store';
import { PersistGate } from 'redux-persist/integration/react';
import { useStore, useSelector } from 'react-redux';
import { createWrapper } from 'next-redux-wrapper';
import useAuth from '@/hooks/useAuth';
import { useRevalidate } from '@/hooks/useRevalidate';
import 'react-toastify/dist/ReactToastify.css';
import { Slide, ToastContainer, toast } from 'react-toastify';

function App({ Component, pageProps }: AppProps) {
  useAuth(false);
  const store: any = useStore();

  useRevalidate();

  return (
    <div className='m-auto max-w-[100rem]'>
      <NextUIProvider className='light'>
        <PersistGate persistor={store.__persistor} loading={<div>loading</div>}>
          <ToastContainer
            toastStyle={{ fontFamily: "'Cairo', sans-serif " }}
            position={toast.POSITION.TOP_CENTER}
            transition={Slide}
            newestOnTop={true}
            rtl={true}
          />
          <Component {...pageProps} />
        </PersistGate>
      </NextUIProvider>
    </div>
  );
}

const wrapper = createWrapper(makeStore);
export default wrapper.withRedux(App);
