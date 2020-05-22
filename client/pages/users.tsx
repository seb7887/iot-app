import React from 'react'
import { NextPage, NextPageContext } from 'next'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import UsersIcon from '@material-ui/icons/Person'
import AddUserIcon from '@material-ui/icons/PersonAdd'

import { authInitialProps } from '../lib'
import { apiGet } from '../services/api'
import Layout from '../components/Layout'
import Toolbar from '../components/Toolbar'
import Table from '../components/Table'

interface Props {
  auth: boolean | null
  users: UsersResponse
}

const Users: NextPage<Props> = ({ users }) => {
  console.log('users', users)
  const columns = ['username', 'email', 'group id']
  const formatData = (data: User[]) => {
    return data.map(d => ({
      id: d.id,
      values: [d.username, d.email, d.groupId]
    }))
  }

  return (
    <Layout>
      <Toolbar header="Users" icon={<UsersIcon />}>
        <Tooltip title="Add new user">
          <IconButton color="primary" aria-label="add-user">
            <AddUserIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>
      <Table columns={columns} rows={formatData(users.users)} />
    </Layout>
  )
}

export const getServerSideProps = async (ctx: NextPageContext) => {
  const authPromise = authInitialProps(true)
  const auth = await authPromise(ctx)

  const users = await apiGet(
    '/users?role=user&page=1&pageSize=20&sortBy=email&sortOrder=ASC',
    ctx
  )

  return {
    props: {
      ...auth,
      users
    }
  }
}

export default Users
