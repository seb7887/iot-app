import React from 'react'
import { useField } from 'formik'
import TextField from '@material-ui/core/TextField'

interface Props {
  label: string
  name: string
  type?: string
}

const FormField: React.FunctionComponent<Props> = props => {
  const [field] = useField(props)

  return (
    <TextField
      {...field}
      variant="outlined"
      margin="normal"
      required
      fullWidth
      id={props.name}
      label={props.label}
      type={props.type}
      name={props.name}
      value={field.value}
      onChange={field.onChange}
    />
  )
}

export default FormField
