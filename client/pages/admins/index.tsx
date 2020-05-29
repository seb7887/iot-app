import React, { useState, useEffect } from 'react'
import { NextPage, NextPageContext } from 'next'
import { useRouter } from 'next/router'
import AdminsIcon from '@material-ui/icons/SupervisorAccount'

import { authInitialProps } from '../../lib'
import { apiGet } from '../../services/api'
import Layout from '../../components/Layout'
import Toolbar from '../../components/Toolbar'
import Table from '../../components/Table'
import Error from '../../components/Error'

interface Props {
  auth: boolean | null
  initialData: UsersResponse
}

const COLUMNS = ['username', 'email']

const getURL = (page: number, pageSize: number) =>
  `/users?role=admin&page=${page}&pageSize=${pageSize}&sortBy=email&sortOrder=ASC`

const getSearchURL = (field: string) =>
  `/users?role=admin&email=${field}&page=1&pageSize=20&sortBy=email&sortOrder=ASC`

const Admins: NextPage<Props> = ({ initialData }) => {
  const [users, setUsers] = useState<UsersResponse>(initialData)
  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(20)
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>('')
  const router = useRouter()

  const formatData = (data: User[]) => {
    return data.map(d => ({
      id: d.id,
      values: [d.username, d.email]
    }))
  }

  useEffect(() => {
    const fetcher = async () => {
      setLoading(true)
      try {
        const data = await apiGet<UsersResponse>(getURL(page + 1, rowsPerPage))
        setUsers(data)
      } catch (err) {
        setError(err.message)
      }
      setLoading(false)
    }
    fetcher()
  }, [page, rowsPerPage])

  useEffect(() => {
    const fetcher = async () => {
      setLoading(true)
      try {
        const data = await apiGet<UsersResponse>(getSearchURL(searchText))
        setUsers(data)
      } catch (err) {
        setError(err.message)
      }
      setLoading(false)
    }
    fetcher()
  }, [searchText])

  const goToUserOverview = (id: string) => {
    router.push(`/admins/${id}`)
  }

  if (error) {
    return <Error message={error} />
  }

  return (
    <Layout>
      <Toolbar header="Admin Users" icon={<AdminsIcon />} />
      {users && (
        <Table
          loading={loading}
          columns={COLUMNS}
          rows={formatData(users.users)}
          count={users.meta.count}
          page={page}
          rowsPerPage={rowsPerPage}
          searchText={searchText}
          searchPlaceholder="Search by email"
          onChangePage={setPage}
          onClickRow={goToUserOverview}
          onChangeRowsPerPage={setRowsPerPage}
          onChangeSearch={setSearchText}
        />
      )}
    </Layout>
  )
}

export const getServerSideProps = async (ctx: NextPageContext) => {
  const authPromise = authInitialProps(true)
  const auth = await authPromise(ctx)

  const initialData = await apiGet(getURL(1, 20), ctx)

  return {
    props: {
      ...auth,
      initialData
    }
  }
}

export default Admins
