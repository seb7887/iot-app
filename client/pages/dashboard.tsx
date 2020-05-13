import React from 'react'
import { NextPage } from 'next'

import { authInitialProps } from '../lib'

const Dashboard: NextPage = () => {
  return <div>Dashboard</div>
}

Dashboard.getInitialProps = authInitialProps(true)

export default Dashboard
