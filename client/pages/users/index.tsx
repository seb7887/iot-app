import React, { useState, useEffect } from 'react'
import { NextPage, NextPageContext } from 'next'
import { useRouter } from 'next/router'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import UsersIcon from '@material-ui/icons/Person'
import AddUserIcon from '@material-ui/icons/PersonAdd'

import { authInitialProps } from '../../lib'
import { apiGet } from '../../services/api'
import Layout from '../../components/Layout'
import Toolbar from '../../components/Toolbar'
import Table from '../../components/Table'
import Error from '../../components/Error'
import Modal from '../../components/Modal'
import UsersForm from '../../components/UsersForm'

interface Props {
  auth: boolean | null
  initialData: UsersResponse
}

const COLUMNS = ['username', 'email', 'group id']

const getURL = (page: number, pageSize: number) =>
  `/users?role=user&page=${page}&pageSize=${pageSize}&sortBy=email&sortOrder=ASC`

const getSearchURL = (field: string) =>
  `/users?role=user&email=${field}&page=1&pageSize=20&sortBy=email&sortOrder=ASC`

const Users: NextPage<Props> = ({ initialData }) => {
  const [users, setUsers] = useState<UsersResponse>(initialData)
  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(20)
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>('')
  const [openModal, setOpenModal] = useState<boolean>(false)
  const router = useRouter()

  const formatData = (data: User[]) => {
    return data.map(d => ({
      id: d.id,
      values: [d.username, d.email, d.groupId]
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

  const handleOpenModal = () => setOpenModal(true)

  const handleCloseModal = () => setOpenModal(false)

  const goToUserOverview = (id: string) => {
    router.push(`/users/${id}`)
  }

  const createUser = (values: Record<string, any>) => {
    console.log('create user', values)
    handleCloseModal()
  }

  if (error) {
    return <Error message={error} />
  }

  return (
    <>
      <Layout>
        <Toolbar header="Users" icon={<UsersIcon />}>
          <Tooltip title="Add new user">
            <IconButton
              color="primary"
              aria-label="add-user"
              onClick={handleOpenModal}
            >
              <AddUserIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
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
      <Modal
        title="Create New User"
        open={openModal}
        onClose={handleCloseModal}
      >
        <UsersForm onSubmit={createUser} />
      </Modal>
    </>
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

export default Users
