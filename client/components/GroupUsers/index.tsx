import React, { useState } from 'react'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import LinearProgress from '@material-ui/core/LinearProgress'
import Typography from '@material-ui/core/Typography'
import UsersIcon from '@material-ui/icons/People'

import Error from '../Error'
import Loader from '../Loader'
import { useStyles } from './styles'
import UserGrid from './UserGrid'

interface Props {
  loading: boolean
  error: string
  users: User[]
  userCount: number
  pageSize: number
  getMore: (page: number) => Promise<void>
}

const GroupUsers: React.FunctionComponent<Props> = ({
  loading,
  error,
  users,
  userCount,
  pageSize,
  getMore
}) => {
  const [page, setPage] = useState<number>(1)
  const [more, setMore] = useState<boolean>(false)
  const styles = useStyles()

  const loadMore = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    setMore(true)
    await getMore(page + 1)
    setPage(page + 1)
    setMore(false)
  }

  if (!loading && error) {
    return <Error message={error} />
  }

  return (
    <>
      <Grid item xs={12} className={styles.section}>
        <UsersIcon className={styles.icon} />
        <Typography component="span">
          <Box
            component="p"
            m={0}
            fontSize="h6.fontSize"
            fontWeight="fontWeightLight"
          >
            USERS {userCount > 0 && <strong>{userCount}</strong>}
          </Box>
        </Typography>
      </Grid>

      {loading ? (
        <Loader message="Loading Users..." />
      ) : (
        <Grid item xs={12}>
          {users.length ? (
            <Grid item xs={12} className={styles.paper}>
              <UserGrid users={users} />
            </Grid>
          ) : (
            <Typography>No users found</Typography>
          )}
          {!more && page + pageSize < userCount && (
            <Button
              variant="outlined"
              color="primary"
              className={styles.moreButton}
              onClick={loadMore}
            >
              Show more
            </Button>
          )}
          {more && (
            <LinearProgress color="primary" className={styles.moreButton} />
          )}
        </Grid>
      )}
    </>
  )
}

export default GroupUsers
