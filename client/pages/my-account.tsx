import React from 'react'
import { NextPage, NextPageContext } from 'next'

import { authInitialProps } from '../lib'
import Layout from '../components/Layout'
import Toolbar from '../components/Toolbar'

interface Props {
  auth: boolean | null
}

const MyAccount: NextPage<Props> = () => (
  <Layout>
    <Toolbar header="My Account" />
  </Layout>
)

export const getServerSideProps = async (ctx: NextPageContext) => {
  const authPromise = authInitialProps(true)
  const auth = await authPromise(ctx)

  return {
    props: {
      ...auth
    }
  }
}

export default MyAccount
