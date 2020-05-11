import React from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Avatar from '@material-ui/core/Avatar'
import LockIcon from '@material-ui/icons/LockOutlined'

import { useAuth } from '../context'

const Login: NextPage = () => {
  const { login } = useAuth()
  const router = useRouter()

  return (
    <Grid container component="main">
      <Grid item xs={false} sm={4} md={7}>
        <Typography variant="body2" align="center">
          IoT
        </Typography>
      </Grid>
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={3} square>
        <Avatar>
          <LockIcon />
        </Avatar>
      </Grid>
    </Grid>
  )
}

export default Login
