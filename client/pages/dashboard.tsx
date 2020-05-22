import React from 'react'
import { NextPage, NextPageContext } from 'next'
import { useRouter } from 'next/router'
import capitalize from 'lodash.capitalize'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Container from '@material-ui/core/Container'
import DevicesIcon from '@material-ui/icons/Router'
import UsersIcon from '@material-ui/icons/Person'
import GroupsIcon from '@material-ui/icons/AccountTreeOutlined'

import { authInitialProps } from '../lib'
import { apiGet } from '../services/api'
import Layout from '../components/Layout'
import EntityCard from '../components/EntityCard'

interface Entity {
  title: string
  count: number
}

interface Props {
  auth: boolean | null
  entities: Entity[]
}

const Dashboard: NextPage<Props> = ({ entities }) => {
  const router = useRouter()
  const styles = useStyles()

  const icon: Record<string, any> = {
    devices: <DevicesIcon className={styles.icon} />,
    users: <UsersIcon className={styles.icon} />,
    groups: <GroupsIcon className={styles.icon} />
  }

  const goToRoute = (idx: number) => {
    const path = `/${entities[idx].title}`
    router.push(path)
  }

  return (
    <Layout>
      <Container className={styles.root}>
        <Grid
          container
          direction="row"
          justify="space-between"
          spacing={6}
          alignItems="center"
          alignContent="flex-start"
          style={{ height: '100%' }}
        >
          {entities.map((entity, index) => (
            <Grid item xs={12} md={4} key={`${entity.title}-${index}`}>
              <EntityCard
                title={capitalize(entity.title)}
                count={entity.count}
                icon={icon[entity.title]}
                onClick={() => goToRoute(index)}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Layout>
  )
}

export const getServerSideProps = async (ctx: NextPageContext) => {
  const authPromise = authInitialProps(true)
  const auth = await authPromise(ctx)

  const [devices, users, groups] = await Promise.all([
    apiGet<DevicesResponse>(
      '/devices?page=1&pageSize=10000&sortBy=id&sortOrder=ASC',
      ctx
    ),
    apiGet<UsersResponse>(
      '/users?page=1&pageSize=10000&sortBy=id&sortOrder=ASC',
      ctx
    ),
    apiGet<GroupsResponse>(
      '/groups?page=1&pageSize=10000&sortBy=id&sortOrder=ASC',
      ctx
    )
  ])

  return {
    props: {
      ...auth,
      entities: [
        {
          title: 'devices',
          count: devices.meta.count
        },
        {
          title: 'users',
          count: users.meta.count
        },
        {
          title: 'groups',
          count: groups.meta.count
        }
      ]
    }
  }
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    padding: theme.spacing(6)
  },
  icon: {
    fontSize: '5rem',
    textAlign: 'center',
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(2),
    alignSelf: 'center'
  }
}))

export default Dashboard
