import React, { useState } from 'react'
import { NextPage, NextPageContext } from 'next'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import Container from '@material-ui/core/Container'
import GroupsIcon from '@material-ui/icons/AccountTreeOutlined'
import AddIcon from '@material-ui/icons/Add'

import { authInitialProps } from '../lib'
import { apiGet } from '../services/api'
import Layout from '../components/Layout'
import Toolbar from '../components/Toolbar'
import GroupList from '../components/GroupList'

interface Props {
  auth: boolean | null
  groups: Group[]
}

const getURL = (parentId = 'top') =>
  `/groups?sortById=id&pageSize=1000&page=1&parentId=${parentId}`

const Groups: NextPage<Props> = ({ groups }) => {
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const handleOpenModal = () => setOpenModal(true)

  const handleCloseModal = () => setOpenModal(false)

  console.log('groups', groups)
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
        <Container>
          <GroupList loading={loading} error={error} groups={groups} />
        </Container>
      </Layout>
    </>
  )
}

export const getServerSideProps = async (ctx: NextPageContext) => {
  const authPromise = authInitialProps(true)
  const auth = await authPromise(ctx)

  const initialData = await apiGet<GroupsResponse>(getURL(), ctx)

  return {
    props: {
      ...auth,
      groups: initialData.groups
    }
  }
}

export default Groups
