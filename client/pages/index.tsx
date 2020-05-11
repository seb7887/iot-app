import React, { useEffect } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'

import { useAuth } from '../context'

const Index: NextPage = () => {
  const { user } = useAuth()
  const router = useRouter()

  // useEffect(() => {
  //   if (!user) {
  //     router.push('/login')
  //   }
  // }, [])

  return <div>Hello World!</div>
}

export default Index
