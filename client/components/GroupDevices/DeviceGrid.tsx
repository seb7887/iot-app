import React from 'react'
import Link from 'next/link'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import { useStyles } from './styles'

interface Props {
  devices: Device[]
}

const DeviceGrid: React.FunctionComponent<Props> = ({ devices }) => {
  const styles = useStyles()

  return (
    <Paper square className={styles.paper}>
      <div className={styles.devicesTitle}>
        <Typography>
          <strong>SERIAL NUMBER</strong>
        </Typography>
        <Typography>
          <strong>DEVICE ID</strong>
        </Typography>
        <Typography>
          <strong>STATUS</strong>
        </Typography>
      </div>

      {devices.map(device => (
        <div key={device.id} className={styles.devicesGrid}>
          <Link href={`/devices/${device.id}`}>
            <Typography>{device.serial}</Typography>
          </Link>

          <Typography>{device.id}</Typography>
          <Typography>{device.connected ? 'ONLINE' : 'OFFLINE'}</Typography>
        </div>
      ))}
    </Paper>
  )
}

export default DeviceGrid
