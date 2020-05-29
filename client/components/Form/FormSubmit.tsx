import React from 'react'
import { useFormikContext } from 'formik'
import Button from '@material-ui/core/Button'

import { useStyles } from './styles'

interface Props {
  text: string
}

const FormSubmit: React.FunctionComponent<Props> = ({ text }) => {
  const styles = useStyles()
  const { isSubmitting } = useFormikContext()

  return (
    <Button
      type="submit"
      fullWidth
      variant="contained"
      color="primary"
      disabled={isSubmitting}
      className={styles.submit}
    >
      {isSubmitting ? `${text}ing...` : text}
    </Button>
  )
}

export default FormSubmit
