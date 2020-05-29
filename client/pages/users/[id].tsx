import React, { useState } from 'react'
import { NextPage, NextPageContext } from 'next'
import { useRouter } from 'next/router'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/lab/Alert'
import DeleteIcon from '@material-ui/icons/Delete'
import UserIcon from '@material-ui/icons/Person'

import { authInitialProps } from '../../lib'
import { useAuth } from '../../context'
import { apiGet, apiDelete } from '../../services/api'
import Layout from '../../components/Layout'
import Toolbar from '../../components/Toolbar'
import UserInfo from '../../components/UserInfo'
import Modal from '../../components/Modal'
import Confirm from '../../components/Confirm'

interface Props {
  auth: boolean | null
  userData: User
}

const User: NextPage<Props> = ({ userData }) => {
  const [openConfirm, setOpenConfirm] = useState<boolean>(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string>('')
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
  const { isAdmin } = useAuth()
  const router = useRouter()

  const handleOpenConfirm = () => setOpenConfirm(true)

  const handleCloseConfirm = () => setOpenConfirm(false)

  const deleteUser = async () => {
    setDeleting(true)
    try {
      await apiDelete(`/users/${userData.id}`)
      setOpenSnackbar(true)
      setTimeout(() => {
        router.push('/users')
      }, 5000)
    } catch (err) {
      setOpenSnackbar(true)
      setError(err.message)
    }
    setDeleting(false)
    handleCloseConfirm()
  }

  return (
    <>
      <Layout>
        <Toolbar
          header={`${userData.username}`}
          caption={`${userData.email}`}
          icon={<UserIcon />}
        >
          {isAdmin() && (
            <Tooltip title="Delete user">
              <IconButton
                color="primary"
                aria-label="delete-user"
                onClick={handleOpenConfirm}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
        </Toolbar>
        <UserInfo data={userData} />
      </Layout>
      <Modal
        title="Delete User"
        open={openConfirm}
        onClose={handleCloseConfirm}
      >
        <Confirm
          onYes={deleteUser}
          onNo={handleCloseConfirm}
          submiting={deleting}
          submitingText="Deleting User"
        />
      </Modal>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
      >
        {error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Alert severity="success">
            User {userData.username} deleted. Redirecting...
          </Alert>
        )}
      </Snackbar>
    </>
  )
}

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
