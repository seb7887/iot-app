import React, { useState } from 'react'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import LinearProgress from '@material-ui/core/LinearProgress'
import Typography from '@material-ui/core/Typography'
import GroupsIcon from '@material-ui/icons/AccountTreeOutlined'

import Error from '../Error'
import Loader from '../Loader'
import GroupsGrid from '../GroupGrid'
import { useStyles } from './styles'

interface Props {
  loading: boolean
  error: string
  groups: Group[]
  pageSize: number
  childCount: number
  getMore: (page: number) => Promise<void>
}

const GroupChildren: React.FunctionComponent<Props> = ({
  loading,
  error,
  groups,
  pageSize,
  childCount,
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
        <GroupsIcon className={styles.icon} />
        <Typography component="span">
          <Box
            component="p"
            m={0}
            fontSize="h6.fontSize"
            fontWeight="fontWeightLight"
          >
            SUB-GROUPS{' '}
            {childCount > 0 && (
              <>
                <strong>{groups.length}</strong> of {childCount}
              </>
            )}
          </Box>
        </Typography>
      </Grid>

      {loading ? (
        <Loader message="Loading Subgroups..." />
      ) : (
        <Grid item xs={12}>
          {groups.length ? (
            <GroupsGrid groups={groups} />
          ) : (
            <Typography>No sub-groups found</Typography>
          )}

          {!more && page + pageSize < childCount && (
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

export default GroupChildren
