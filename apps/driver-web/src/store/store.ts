import {
  configureStore,
  combineReducers,
  ThunkAction,
  Action,
} from "@reduxjs/toolkit";
import createFilter from "redux-persist-transform-filter";
import { authSlice } from "./slices/authSlice";
import { tripsSlice } from "./slices/tripsSlice";
import { mobileAuthSlice } from "./slices/mobileAuthSlice";
import { createWrapper } from "next-redux-wrapper";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

const rootReducer = combineReducers({
  [authSlice.name]: authSlice.reducer,
  [tripsSlice.name]: tripsSlice.reducer,
  [mobileAuthSlice.name]: mobileAuthSlice.reducer,
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
    const persistConfig = {
      key: "driver-web",
      whitelist: ["auth"],
      storage,
      transforms: [
        createFilter('auth',['isAuthenticated','token','refreshToken','status','profile','canManageDrivers','canUpgrade','canPublish']),
      ]
    };

    const persistedReducer = persistReducer(persistConfig, rootReducer);
    let store: any = configureStore({
      reducer: persistedReducer,
      devTools: process.env.NODE_ENV !== "production",
    });

    store.__persistor = persistStore(store);

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
