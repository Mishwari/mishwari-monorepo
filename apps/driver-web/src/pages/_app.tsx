import '@mishwari/ui-web/styles/globals.css';
import { NextUIProvider } from '@nextui-org/react';
import type { AppProps } from 'next/app';
import { makeStore, AppState } from '@/store/store';
import { PersistGate } from 'redux-persist/integration/react';
import { useStore, useSelector } from 'react-redux';
import { createWrapper } from 'next-redux-wrapper';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useAuth from '@/hooks/useAuth';
import { useRevalidate } from '@/hooks/useRevalidate';
import 'react-toastify/dist/ReactToastify.css';
import { Slide, ToastContainer, toast } from 'react-toastify';

function App({ Component, pageProps }: AppProps) {
  useAuth(false);
  const store: any = useStore();
  const router = useRouter();
  const { isAuthenticated, profile } = useSelector((state: AppState) => state.auth);

  useRevalidate();

  useEffect(() => {
    const publicPaths = ['/login', '/login/complete_profile'];
    
    // Wait for profile to be loaded before checking
    if (!isAuthenticated || !profile || publicPaths.includes(router.pathname)) {
      return;
    }
    
    const nestedProfile = (profile as any)?.profile;
    const fullName = profile?.full_name || nestedProfile?.full_name;
    const isStandalone = (profile as any)?.is_standalone;
    const hasOperatorName = !!(profile as any)?.operator_name;
    
    // Only redirect if: no full_name AND is standalone (not invited driver)
    // Invited drivers have is_standalone=false or have operator_name
    if (!fullName && isStandalone !== false && !hasOperatorName) {
      router.push('/login/complete_profile');
    }
  }, [isAuthenticated, profile, router.pathname]);

  return (
    <div className='m-auto max-w-[100rem]'>
      <NextUIProvider className='light'>
        <PersistGate persistor={store.__persistor} loading={
          <div className='min-h-screen bg-gradient-to-b from-primary-light to-white flex items-center justify-center'>
            <div className='text-center'>
              <div className='w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
              <p className='text-primary font-bold text-lg'>مشواري</p>
            </div>
          </div>
        }>
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
