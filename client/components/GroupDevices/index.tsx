import React, { useState } from 'react'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import LinearProgress from '@material-ui/core/LinearProgress'
import Typography from '@material-ui/core/Typography'
import DevicesIcon from '@material-ui/icons/Devices'

import Error from '../Error'
import Loader from '../Loader'
import { useStyles } from './styles'
import DeviceGrid from './DeviceGrid'

interface Props {
  loading: boolean
  error: string
  devices: Device[]
  deviceCount: number
  pageSize: number
  getMore: (page: number) => Promise<void>
}

const GroupDevices: React.FunctionComponent<Props> = ({
  loading,
  error,
  devices,
  deviceCount,
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
        <DevicesIcon className={styles.icon} />
        <Typography component="span">
          <Box
            component="p"
            m={0}
            fontSize="h6.fontSize"
            fontWeight="fontWeightLight"
          >
            DEVICES {deviceCount > 0 && <strong>{deviceCount}</strong>}
          </Box>
        </Typography>
      </Grid>

      {loading ? (
        <Loader message="Loading Devices..." />
      ) : (
        <Grid item xs={12}>
          {devices.length ? (
            <DeviceGrid devices={devices} />
          ) : (
            <Typography>No devices found</Typography>
          )}
          {!more && page + pageSize < deviceCount && (
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

export default GroupDevices
