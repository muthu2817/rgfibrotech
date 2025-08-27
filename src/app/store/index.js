import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from './slices/getUserSlice';
import pageDetailsReducer from './slices/getPageDetailsSlice';
import authReducer from './slices/authSlice';
import departmentReducer from './slices/departmentSlice';

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['token']
};

const rootReducer = combineReducers({
  userItem: userReducer,
  pageDetails: pageDetailsReducer,
  auth: persistReducer(authPersistConfig, authReducer),
  department: departmentReducer
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/PURGE',
          'persist/FLUSH',
          'persist/REGISTER'
        ]
      }
    })
});

export const persistor = persistStore(store);
