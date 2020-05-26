import React from 'react'
import Alert from '@material-ui/lab/Alert'
import ErrorIcon from '@material-ui/icons/ErrorOutline'

interface Props {
  error: string
}

const FormError: React.FunctionComponent<Props> = ({ error }) => {
  return (
    <Alert severity="error">
      <ErrorIcon />
      {error}
    </Alert>
  )
}

export default FormError
