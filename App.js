import React from 'react';
import { Provider } from 'react-redux';
import MainNavigator from './MainNavigator';
import store from './components/store';

export default function App() {
  return (
    <Provider store={store}>
      <MainNavigator />
    </Provider>
  );
}
