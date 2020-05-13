import React from 'react'
import { NextPage } from 'next'

import { authInitialProps } from '../lib'
import Layout from '../components/Layout'

const Dashboard: NextPage = () => {
  return (
    <Layout>
      <h1>Dashboard</h1>
    </Layout>
  )
}

Dashboard.getInitialProps = authInitialProps(true)

export default Dashboard
