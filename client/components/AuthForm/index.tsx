import React, { useState } from 'react'
import Link from '@material-ui/core/Link'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { Alert } from '@material-ui/lab'

import { useStyles } from './styles'

interface Props {
  onSubmit: (type: AuthType, state: Record<string, string>) => Promise<void>
  onForgotPassword: () => void
  error: string
  loading: boolean
}

interface State {
  email: string
  username: string
  password: string
}

const AuthForm: React.FunctionComponent<Props> = props => {
  const [activeTab, setActiveTab] = useState<number>(0)
  const [state, setState] = useState<State>({
    email: '',
    username: '',
    password: ''
  })
  const { onSubmit, onForgotPassword, error, loading } = props
  const isLogin = activeTab === 0
  const styles = useStyles()

  const handleTabChange = (event: React.ChangeEvent<{}>, value: any) => {
    event.preventDefault()
    setActiveTab(value)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setState(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    const type: AuthType = activeTab === 0 ? 'login' : 'register'
    onSubmit(type, {
      username: state.username,
      email: state.email,
      password: state.password
    })
  }

  return (
    <>
      {error && (
        <Alert severity="error" className={styles.alert}>
          {error}
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
      <form onSubmit={handleSubmit} className={styles.form}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoFocus
          onChange={handleInputChange}
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
            onChange={handleInputChange}
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
          onChange={handleInputChange}
        />
        <div className={styles.formActions}>
          {loading ? (
            <CircularProgress size={30} />
          ) : (
            <Button type="submit" fullWidth variant="contained" color="primary">
              {isLogin ? 'Sign In' : 'Sign Up'}
            </Button>
          )}
        </div>
      </form>
      {!loading && isLogin && (
        <Grid container>
          <Link
            variant="body1"
            className={styles.link}
            onClick={onForgotPassword}
          >
            Forgot password?
          </Link>
        </Grid>
      )}
    </>
  )
}

export default AuthForm
