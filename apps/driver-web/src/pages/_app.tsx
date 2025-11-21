import '@/styles/globals.css';
import '@/styles/fonts.css';
import { NextUIProvider } from '@nextui-org/react';
import type { AppProps } from 'next/app';
import { makeStore, AppState } from '@/store/store';
import { PersistGate } from 'redux-persist/integration/react';
import { useStore, useSelector } from 'react-redux';
import { createWrapper } from 'next-redux-wrapper';
import useAuth from '@/hooks/useAuth';
import { useRevalidate } from '@/hooks/useRevalidate';
import { apiClient } from '@mishwari/api';
import { useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { Slide, ToastContainer, toast } from 'react-toastify';

function App({ Component, pageProps }: AppProps) {
  useAuth(false);
  const store: any = useStore();
  const { token } = useSelector((state: AppState) => state.auth);

  useEffect(() => {
    if (apiClient && typeof apiClient.setTokenGetter === 'function') {
      apiClient.setTokenGetter(() => token);
    }
  }, [token]);

  useRevalidate();

  return (
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
  );
}

const wrapper = createWrapper(makeStore);
export default wrapper.withRedux(App);
