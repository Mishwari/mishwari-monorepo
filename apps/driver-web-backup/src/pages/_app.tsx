import {useEffect} from 'react'
import '@/styles/globals.css'
import '@/styles/fonts.css'
import type { AppProps } from 'next/app'
import { makeStore } from '@/store/store'
import { PersistGate } from 'redux-persist/integration/react'
import { useStore } from 'react-redux'
import { useDispatch, useSelector } from 'react-redux';
import {fetchUserDetails } from '@/actions/authActions'
import { createWrapper } from 'next-redux-wrapper'
import { fetchTripsDetails } from '@/actions/tripsActions'
import { fetchDriverDetails } from '@/actions/driverActions'
import { apiClient } from '@mishwari/api'
// react toast
import 'react-toastify/dist/ReactToastify.css'
import { Slide, Bounce, Zoom, Flip, ToastContainer,toast } from 'react-toastify'

 function App({ Component, pageProps }: AppProps) {

  const store:any = useStore();
  const dispatch = useDispatch();
  const { isAuthenticated, token } = useSelector((state: any) => state.auth);

  // Setup API client token getter
  useEffect(() => {
    apiClient.setTokenGetter(() => store.getState().auth.token);
  }, [store]);

  useEffect(() => {
    if (isAuthenticated && token) {
      dispatch(fetchUserDetails(token) as any);
      dispatch(fetchTripsDetails(token) as any);
      dispatch(fetchDriverDetails(token) as any)
    }
  }, [dispatch, isAuthenticated, token]);

  return(
    <PersistGate persistor={store.__persistor} loading={<div>loading</div>} >
      <Component {...pageProps} />
      <ToastContainer  toastStyle={{fontFamily: "'Cairo', sans-serif"}} position={toast.POSITION.TOP_CENTER} transition={Slide} newestOnTop={true} rtl={true}  />
    </PersistGate>
  )

  
}

const wrapper = createWrapper(makeStore)
export default wrapper.withRedux(App);
