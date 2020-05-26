import React from 'react'
import { useFormikContext } from 'formik'
import Button from '@material-ui/core/Button'

interface Props {
  text: string
}

const isEmpty = (values: any) => {
  for (const key in values) {
    if (values[key] !== '') {
      return false
    }
  }
  return true
}

const FormSubmit: React.FunctionComponent<Props> = ({ text }) => {
  const { isSubmitting, values } = useFormikContext()
  const isDisabled = isSubmitting && isEmpty(values)

  return (
    <Button
      type="submit"
      fullWidth
      variant="contained"
      color="primary"
      disabled={isDisabled}
    >
      {isSubmitting ? `${text}ing...` : text}
    </Button>
  )
}

export default FormSubmit
