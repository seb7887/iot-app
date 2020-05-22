import React from 'react'
import { NextPage } from 'next'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Avatar from '@material-ui/core/Avatar'
import LockIcon from '@material-ui/icons/LockOutlined'

import { authInitialProps } from '../lib'
import AuthForm from '../components/AuthForm'

const Index: NextPage = () => {
  const styles = useStyles()

  return (
    <Grid className={styles.root} container component="main">
      <Grid className={styles.logoContainer} item xs={false} sm={4} md={7}>
        <div className={styles.container}>
          <img src="/logo.png" alt="logo" className={styles.logo} />
          <Typography variant="h2" align="center" className={styles.logoTitle}>
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
          <AuthForm />
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
  logoTitle: {
    fontFamily: 'Bungee Inline'
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
