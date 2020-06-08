import React from 'react'
import Link from 'next/link'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import { useStyles } from './styles'

interface Props {
  users: User[]
}

const UserGrid: React.FunctionComponent<Props> = ({ users }) => {
  const styles = useStyles()

  return (
    <Paper square className={styles.paper}>
      <div className={styles.userTitle}>
        <Typography>
          <strong>EMAIL</strong>
        </Typography>
        <Typography>
          <strong>USERNAME</strong>
        </Typography>
      </div>

      {users.map(user => (
        <div key={user.id} className={styles.userGrid}>
          <Link href={`/users/${user.id}`}>
            <Typography>{user.email}</Typography>
          </Link>

          <Typography>{user.username}</Typography>
        </div>
      ))}
    </Paper>
  )
}

export default UserGrid
