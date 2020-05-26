import React, { useState } from 'react'

import Form, { Field, Submit } from '../Form'

interface Values {
  email: string
  username: string
  password: string
}

interface Props {
  onSubmit: (values: Values) => void
}

const UsersForm: React.FunctionComponent<Props> = ({ onSubmit }) => {
  const [error, setError] = useState<string>('')
  const initialValues: Values = {
    email: '',
    username: '',
    password: ''
  }

  const submit = (values: any, actions: any) => {
    actions.setSubmitting(true)
    try {
      onSubmit(values)
    } catch (err) {
      setError(err.message)
    }
    actions.setSubmitting(false)
  }

  return (
    <Form initialValues={initialValues} onSubmit={submit} error={error}>
      <Field name="email" label="Email" />
      <Field name="username" label="Username" />
      <Field name="password" label="Password" type="password" />
      <Submit text="Create" />
    </Form>
  )
}

export default UsersForm
