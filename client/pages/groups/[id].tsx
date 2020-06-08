import React, { useState } from 'react'
import { NextPage, NextPageContext } from 'next'
import { useRouter } from 'next/router'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import BackIcon from '@material-ui/icons/ArrowBack'

import { authInitialProps } from '../../lib'
import { apiGet, apiDelete } from '../../services/api'
import Layout from '../../components/Layout'
import Toolbar from '../../components/Toolbar'
import ThreeDotMenu from '../../components/ThreeDotMenu'
import GroupChildren from '../../components/GroupChildren'
import GroupUsers from '../../components/GroupUsers'
import GroupDevices from '../../components/GroupDevices'
import Modal from '../../components/Modal'
import Confirm from '../../components/Confirm'

interface Props {
  auth: boolean
  group: Group
  children: GroupsResponse
  groupUsers: UsersResponse
  groupDevices: DevicesResponse
}

const getURL = (id: string) => `/groups/${id}`

const getChildrenURL = (id: string, page: number) =>
  `/groups?sortBy=id&pageSize=9&page=${page}&parentId=${id}`

const getUsersURL = (id: string, page: number) =>
  `/users?groupId=${id}&sortBy=id&pageSize=9&page=${page}`

const getDevicesURL = (id: string, page: number) =>
  `/devices?groupId=${id}&sortBy=id&pageSize=9&page=${page}`

const Group: NextPage<Props> = ({
  group,
  children,
  groupUsers,
  groupDevices
}) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [openConfirm, setOpenConfirm] = useState<boolean>(false)
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const [openError, setOpenError] = useState<boolean>(false)
  const [deleting, setDeleting] = useState<boolean>(false)
  // const [updating, setUpdating] = useState<boolean>(false)
  const [subgroups, setSubgroups] = useState<Group[]>(children.groups)
  const [subgroupsMeta, setSubgroupsMeta] = useState<Meta>(children.meta)
  const [users, setUsers] = useState<User[]>(groupUsers.users)
  const [usersMeta, setUsersMeta] = useState<Meta>(groupUsers.meta)
  const [devices, setDevices] = useState<Device[]>(groupDevices.devices)
  const [devicesMeta, setDevicesMeta] = useState<Meta>(groupDevices.meta)
  const { query, back, push } = useRouter()
  const { id } = query
  const styles = useStyles()

  const handleOpenConfirm = () => setOpenConfirm(true)

  const handleCloseConfirm = () => setOpenConfirm(false)

  const handleOpenEdit = () => setOpenEdit(true)

  const handleCloseEdit = () => setOpenEdit(false)

  const handleOpenError = () => setOpenError(true)

  const menu = [
    {
      label: 'Edit group',
      action: handleOpenEdit
    },
    {
      label: 'Delete group',
      action: handleOpenConfirm
    }
  ]

  const loadMoreChildren = async (page: number) => {
    setLoading(true)
    try {
      const data = await apiGet<GroupsResponse>(
        getChildrenURL(id as string, page)
      )
      const newChildren = subgroups.concat(data.groups)
      setSubgroups(newChildren)
      setSubgroupsMeta(data.meta)
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  const loadMoreUsers = async (page: number) => {
    setLoading(true)
    try {
      const data = await apiGet<UsersResponse>(getUsersURL(id as string, page))
      const newUsers = users.concat(data.users)
      setUsers(newUsers)
      setUsersMeta(data.meta)
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  const loadMoreDevices = async (page: number) => {
    setLoading(true)
    try {
      const data = await apiGet<DevicesResponse>(
        getDevicesURL(id as string, page)
      )
      const newDevices = devices.concat(data.devices)
      setDevices(newDevices)
      setDevicesMeta(data.meta)
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  const goBack = (e: React.SyntheticEvent) => {
    e.preventDefault()
    back()
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await apiDelete(`/groups/${id}`)
      push('/groups')
    } catch (err) {
      setDeleting(false)
      handleOpenError()
    }
    handleCloseConfirm()
  }

  return (
    <>
      <Layout>
        <Toolbar
          header={!loading ? `${group.name}` : ''}
          icon={<BackIcon className={styles.back} onClick={goBack} />}
        >
          <ThreeDotMenu menu={menu} />
        </Toolbar>
        <Container>
          <Grid
            container
            direction="row"
            spacing={2}
            className={styles.container}
          >
            <GroupChildren
              groups={subgroups}
              childCount={subgroupsMeta.count}
              loading={loading}
              error={error}
              pageSize={9}
              getMore={loadMoreChildren}
            />

            <GroupUsers
              users={users}
              userCount={usersMeta.count}
              loading={loading}
              error={error}
              pageSize={9}
              getMore={loadMoreUsers}
            />

            <GroupDevices
              devices={devices}
              deviceCount={devicesMeta.count}
              loading={loading}
              error={error}
              pageSize={9}
              getMore={loadMoreDevices}
            />
          </Grid>
        </Container>
      </Layout>
      <Modal
        title="DELETE GROUP"
        open={openConfirm}
        onClose={handleCloseConfirm}
      >
        <Confirm
          onYes={handleDelete}
          onNo={handleCloseConfirm}
          submiting={deleting}
          submitingText="Deleting group"
        />
      </Modal>
    </>
  )
}

export const getServerSideProps = async (ctx: NextPageContext) => {
  const authPromise = authInitialProps(true)
  const auth = await authPromise(ctx)
  const { id } = ctx.query

  const groupData = await apiGet<GroupResponse>(getURL(id as string), ctx)
  const children = await apiGet<GroupsResponse>(
    getChildrenURL(id as string, 1),
    ctx
  )
  const groupUsers = await apiGet<UsersResponse>(
    getUsersURL(id as string, 1),
    ctx
  )
  const groupDevices = await apiGet<DevicesResponse>(
    getDevicesURL(id as string, 1),
    ctx
  )

  return {
    props: {
      ...auth,
      group: groupData.group,
      children,
      groupUsers,
      groupDevices
    }
  }
}

const useStyles = makeStyles((theme: Theme) => ({
  back: {
    color: theme.palette.primary.main,
    cursor: 'pointer'
  },
  container: {
    padding: theme.spacing(3)
  },
  section: {
    display: 'flex',
    alignItems: 'center',
    margin: theme.spacing(2, 0, 2, 0),
    '&:first-of-type': {
      marginTop: 0
    }
  },
  icon: {
    marginRight: theme.spacing(1)
  }
}))

export default Group
