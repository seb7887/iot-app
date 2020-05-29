import React, { useState } from 'react'
import { NextPage, NextPageContext } from 'next'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import GroupsIcon from '@material-ui/icons/AccountTreeOutlined'
import AddIcon from '@material-ui/icons/Add'

import { authInitialProps } from '../lib'
import Layout from '../components/Layout'
import Toolbar from '../components/Toolbar'

interface Props {
  auth: boolean | null
}

const Groups: NextPage<Props> = () => {
  const [openModal, setOpenModal] = useState<boolean>(false)

  const handleOpenModal = () => setOpenModal(true)

  const handleCloseModal = () => setOpenModal(false)

  return (
    <>
      <Layout>
        <Toolbar header="Groups" icon={<GroupsIcon />}>
          <Tooltip title="Add new group">
            <IconButton
              color="primary"
              aria-label="add-group"
              onClick={handleOpenModal}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </Layout>
    </>
  )
}

export const getServerSideProps = async (ctx: NextPageContext) => {
  const authPromise = authInitialProps(true)
  const auth = await authPromise(ctx)

  return {
    props: {
      ...auth
    }
  }
}

export default Groups
