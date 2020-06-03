import React from 'react'
import Link from 'next/link'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActionArea from '@material-ui/core/CardActionArea'
import Typography from '@material-ui/core/Typography'

import { useStyles } from './styles'

interface Props {
  group: Group
}

const GroupCard: React.FunctionComponent<Props> = ({ group }) => {
  const styles = useStyles()

  return (
    <Link href={`/groups/${group.id}`}>
      <Card variant="outlined" className={styles.groupCard}>
        <CardActionArea>
          <CardContent>
            <Typography variant="h6">{group.name}</Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  )
}

export default GroupCard
