import React from 'react'
import { NextPage, NextPageContext } from 'next'
import AdminsIcon from '@material-ui/icons/SupervisorAccount'

import { authInitialProps } from '../../lib'
import { apiGet } from '../../services/api'
import Layout from '../../components/Layout'
import Toolbar from '../../components/Toolbar'
import UserInfo from '../../components/UserInfo'

interface Props {
  auth: boolean | null
  userData: User
}

const User: NextPage<Props> = ({ userData }) => (
  <Layout>
    <Toolbar
      header={`${userData.username}`}
      caption={`${userData.email}`}
      icon={<AdminsIcon />}
    />
    <UserInfo data={userData} />
  </Layout>
)

export const getServerSideProps = async (ctx: NextPageContext) => {
  const authPromise = authInitialProps(true)
  const auth = await authPromise(ctx)

  const initialData = await apiGet<UserResponse>(`/users/${ctx.query.id}`, ctx)

  return {
    props: {
      ...auth,
      userData: initialData.user
    }
  }
}

export default User
