import {
    configureStore,
    combineReducers,
    ThunkAction,
    Action,
  } from "@reduxjs/toolkit";
  import createFilter from "redux-persist-transform-filter";
  import { authSlice } from "./slices/authSlice";
  import { userSlice } from "./slices/userSlice";
  import { passengersSlice } from "./slices/passengersSlice";
  import {selectedTripSlice} from "./slices/selectedTripSlice";
  import { bookingCreationSlice } from "./slices/bookingCreationSlice";
  import { mobileAuthSlice } from "./slices/mobileAuthSlice";
  import {profileSlice} from "./slices/profileSlice";
//   import { driverSlice } from "@/slices/driverSlice";
//   import {tripsSlice} from "@/slices/tripsSlice";
  import { createWrapper } from "next-redux-wrapper";
  import { persistReducer, persistStore } from "redux-persist";
  import storage from "redux-persist/lib/storage";
  
  const rootReducer = combineReducers({
    [authSlice.name]: authSlice.reducer,
    [userSlice.name]: userSlice.reducer,
    [passengersSlice.name]: passengersSlice.reducer,
    [selectedTripSlice.name]: selectedTripSlice.reducer,
    [bookingCreationSlice.name]: bookingCreationSlice.reducer,
    [mobileAuthSlice.name] : mobileAuthSlice.reducer,
    [profileSlice.name]: profileSlice.reducer
    // trips: tripsSlice.reducer,

  });
  
  const makeConfiguredStore = () =>
    configureStore({
      reducer: rootReducer,
      devTools: true,
    });
  
  export const makeStore = () => {
    const isServer = typeof window === "undefined";
  
    if (isServer) {
      return makeConfiguredStore();
    } else {
      // we need it only on client side
  
      const persistConfig = {
        key: "passenger-web",
        whitelist: ["auth"],
        storage,
        transforms: [
          createFilter('auth',['isAuthenticated','token','refreshToken']),
        ]
      };
  
      const persistedReducer = persistReducer(persistConfig, rootReducer);
      let store: any = configureStore({
        reducer: persistedReducer,
        devTools: process.env.NODE_ENV !== "production",
      });
  
      store.__persistor = persistStore(store); // Nasty hack
  
      return store;
    }
  };
  
  export type AppStore = ReturnType<typeof makeStore>;
  export type AppState = ReturnType<AppStore["getState"]>;
  export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    AppState,
    unknown,
    Action
  >;
  
  export const wrapper = createWrapper<AppStore>(makeStore);