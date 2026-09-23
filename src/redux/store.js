import { combineReducers, configureStore } from '@reduxjs/toolkit'
import infoReducer from './action/infoSlice'
import { persistStore, persistReducer } from "redux-persist";
import storageDefault from "redux-persist/lib/storage";
import emailAuthReducer from './action/emailAuthSlice';
import userInfoReducer from './action/userInfoSlice';
import isAuthReducer from './action/isAuthSlice';

const storage = storageDefault.default || storageDefault;

const persistConfig = {
    key : 'root',
    storage,
    whitelist : ['information','emailForToken','userInformation','isAuth']
}

const rootReducer = combineReducers({information : infoReducer, emailForToken : emailAuthReducer, userInformation : userInfoReducer,
  isAuth : isAuthReducer
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const presistor = persistStore(store); 