import React, { useState } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Avatar from '@material-ui/core/Avatar'
import LockIcon from '@material-ui/icons/LockOutlined'

import { useAuth } from '../context'
import { authInitialProps } from '../lib'
import AuthForm from '../components/AuthForm'

interface State {
  loading: boolean
  error: string
}

const Index: NextPage = () => {
  const [state, setState] = useState<State>({
    loading: false,
    error: ''
  })
  const { signIn, signUp } = useAuth()
  const styles = useStyles()
  const router = useRouter()
  const { loading, error } = state

  const submit = async (
    type: AuthType,
    credentials: Record<string, string>
  ) => {
    setState(prev => ({
      ...prev,
      loading: true
    }))
    try {
      let user
      if (type === 'login') {
        user = await signIn(credentials.email, credentials.password)
      } else {
        user = await signUp(
          credentials.username,
          credentials.email,
          credentials.password
        )
      }
      localStorage.setItem('user', JSON.stringify(user))
      setState(prev => ({
        ...prev,
        loading: false
      }))
    } catch (err) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: err.message
      }))
    }
  }

  const goToResetPassword = () => {
    router.push('/reset-password')
  }

  return (
    <Grid className={styles.root} container component="main">
      <Grid className={styles.logoContainer} item xs={false} sm={4} md={7}>
        <div className={styles.container}>
          <img src="/logo.png" alt="logo" className={styles.logo} />
          <Typography variant="h1" align="center">
            IoT
          </Typography>
        </div>
      </Grid>
      <Grid
        className={styles.loginContainer}
        item
        xs={12}
        sm={8}
        md={5}
        component={Paper}
        elevation={7}
        square
      >
        <div className={styles.container}>
          <Avatar className={styles.avatar}>
            <LockIcon />
          </Avatar>
          <AuthForm
            onSubmit={submit}
            onForgotPassword={goToResetPassword}
            error={error}
            loading={loading}
          />
        </div>
      </Grid>
    </Grid>
  )
}

Index.getInitialProps = authInitialProps()

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: '100vh'
  },
  logoContainer: {
    background:
      'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(126,82,160,1) 79%)'
  },
  logo: {
    width: '45%',
    height: '50%'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main
  },
  container: {
    margin: theme.spacing(0, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
  },
  loginContainer: {
    backgroundColor: theme.palette.background.default
  }
}))

export default Index
