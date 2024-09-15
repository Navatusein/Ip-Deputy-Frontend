import {combineReducers, configureStore, ThunkMiddleware} from "@reduxjs/toolkit";
import {userReducer} from "@/entities/user";
import {baseApi} from "@/shared/api/base-query.ts";

const IS_DEV_ENVIRONMENT = import.meta.env.VITE_ENVIRONMENT === "Development";

const rootReducer = combineReducers({
  user: userReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

const middlewares: ThunkMiddleware[] = [
  baseApi.middleware,
]

export const store = configureStore({
  reducer: rootReducer,
  devTools: IS_DEV_ENVIRONMENT,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  }).concat(middlewares)
});

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof configureStore>
export type AppDispatch = typeof store.dispatch