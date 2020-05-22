import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useFormik } from 'formik'
import Link from '@material-ui/core/Link'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { Alert } from '@material-ui/lab'

import { useAuth } from '../../context'
import { useStyles } from './styles'

const AuthForm: React.FunctionComponent = () => {
  const [activeTab, setActiveTab] = useState<number>(0)
  const router = useRouter()
  const { signIn, signUp } = useAuth()
  const formik = useFormik({
    initialValues: {
      email: '',
      username: '',
      password: ''
    },
    onSubmit: async (values, actions) => {
      actions.setSubmitting(true)
      const type: AuthType = activeTab === 0 ? 'login' : 'register'

      try {
        let user
        if (type === 'login') {
          user = await signIn(values.email, values.password)
        } else {
          user = await signUp(values.username, values.email, values.password)
        }
        localStorage.setItem('user', JSON.stringify(user))
        router.reload()
      } catch (err) {
        actions.setErrors({
          password: err.message
        })
      }
      actions.setSubmitting(false)
    }
  })
  const isLogin = activeTab === 0
  const styles = useStyles()

  const handleTabChange = (event: React.ChangeEvent<{}>, value: any) => {
    event.preventDefault()
    setActiveTab(value)
  }

  const goToResetPassword = () => {
    router.push('/reset-password')
  }

  return (
    <>
      {formik.errors.password && (
        <Alert severity="error" className={styles.alert}>
          {formik.errors.password}
        </Alert>
      )}
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
      >
        <Tab label="Sign In" />
        <Tab label="Sign Up" />
      </Tabs>
      <form onSubmit={formik.handleSubmit} className={styles.form}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoFocus
          onChange={formik.handleChange}
        />
        {!isLogin && (
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            onChange={formik.handleChange}
          />
        )}
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="password"
          type="password"
          label="Password"
          name="password"
          onChange={formik.handleChange}
        />
        <div className={styles.formActions}>
          {formik.isSubmitting ? (
            <CircularProgress size={30} />
          ) : (
            <Button type="submit" fullWidth variant="contained" color="primary">
              {isLogin ? 'Sign In' : 'Sign Up'}
            </Button>
          )}
        </div>
      </form>
      {!formik.isSubmitting && isLogin && (
        <Grid container>
          <Link
            variant="body1"
            className={styles.link}
            onClick={goToResetPassword}
          >
            Forgot password?
          </Link>
        </Grid>
      )}
    </>
  )
}

export default AuthForm
