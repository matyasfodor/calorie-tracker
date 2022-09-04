import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ApolloProvider } from '@apollo/client'

import './index.css'
import App from './App'
import { apolloClient } from './apolloClient'
import { AuthContextProvider } from './contexts/AuthContext'

import dayjs_plugin_timezone from 'dayjs/plugin/timezone'
import dayjs_plugin_utc from 'dayjs/plugin/utc'
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'

dayjs.extend(relativeTime)
dayjs.extend(dayjs_plugin_utc)
dayjs.extend(dayjs_plugin_timezone)

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <BrowserRouter>
        <AuthContextProvider
          onAuthChange={() => {
            void apolloClient.refetchQueries({
              include: 'all',
            })
          }}
        >
          <App />
        </AuthContextProvider>
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>,
)
