import React from 'react'
import { NextPage } from 'next'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Avatar from '@material-ui/core/Avatar'
import LockIcon from '@material-ui/icons/LockOutlined'

// import { useAuth } from '../context'

const Login: NextPage = () => {
  const styles = useStyles()

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
        <Avatar>
          <LockIcon />
        </Avatar>
      </Grid>
    </Grid>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: '100vh'
  },
  logoContainer: {
    background:
      'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(61,52,139,1) 79%)'
  },
  logo: {
    width: '45%',
    height: '50%'
  },
  container: {
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

export default Login
