import React from 'react'
import { NextPage, NextPageContext } from 'next'

import { authInitialProps } from '../lib'
import { apiGet } from '../services/api'
import Layout from '../components/Layout'

interface Props {
  auth: boolean | null
  users: UsersResponse
}

const Users: NextPage<Props> = ({ users }) => {
  console.log('users', users)
  return (
    <Layout>
      <h1>Users</h1>
    </Layout>
  )
}

export const getServerSideProps = async (ctx: NextPageContext) => {
  const authPromise = authInitialProps(true)
  const auth = await authPromise(ctx)

  const users = await apiGet(
    '/users?role=user&page=1&pageSize=20&sortBy=email&sortOrder=ASC'
  )

  return {
    props: {
      ...auth,
      users
    }
  }
}

export default Users
