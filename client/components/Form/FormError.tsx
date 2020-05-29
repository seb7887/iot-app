import React from 'react'
import Alert from '@material-ui/lab/Alert'

interface Props {
  error: string
}

const FormError: React.FunctionComponent<Props> = ({ error }) => {
  return <Alert severity="error">{error}</Alert>
}

export default FormError
