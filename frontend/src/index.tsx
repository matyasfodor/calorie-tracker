import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import { ApolloProvider } from '@apollo/client';

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { apolloClient } from './apolloClient';
import { AuthContextProvider } from './contexts/AuthContext';


import dayjs_plugin_timezone from 'dayjs/plugin/timezone';
import dayjs_plugin_utc from 'dayjs/plugin/utc';
import dayjs from 'dayjs';

dayjs.extend(dayjs_plugin_utc)
dayjs.extend(dayjs_plugin_timezone)

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <BrowserRouter>
        <AuthContextProvider
          onAuthChange={() => apolloClient.refetchQueries({
            include: 'all',
          })}
        >
          <App />
        </AuthContextProvider>
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
