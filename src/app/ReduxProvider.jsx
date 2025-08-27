'use client';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/index';
import { setAuthTokenGetter } from './API/axiosInterceptor';

const ReduxProvider = ({ children }) => {
  // Attach token getter once provider mounts (client-only file)
  setAuthTokenGetter(() => store.getState().auth.token);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};

export default ReduxProvider;
