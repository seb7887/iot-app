import React, { useEffect } from 'react'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseLine from '@material-ui/core/CssBaseline'

import theme from '../utils/theme'
import { AuthProvider } from '../context'

export default function MyApp(props: AppProps) {
  const { Component, pageProps } = props

  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles)
    }
  }, [])

  return (
    <>
      <Head>
        <title>IoT Manager Dashboard</title>
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseLine />
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </ThemeProvider>
    </>
  )
}
