import React from 'react'
import { Formik, Form as FormikForm } from 'formik'

import FormError from './FormError'

interface Props {
  initialValues: Record<string, any>
  onSubmit: (values: any, actions: any) => void
  error: string
}

const Form: React.FunctionComponent<Props> = ({
  initialValues,
  onSubmit,
  error,
  children
}) => {
  return (
    <>
      <FormError error={error} />
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={onSubmit}
      >
        <FormikForm>{children}</FormikForm>
      </Formik>
    </>
  )
}

export { default as Field } from './FormField'
export { default as Submit } from './FormSubmit'
export default Form
