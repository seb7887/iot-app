import React from 'react'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import CountUp from 'react-countup'

import { useStyles } from './styles'

interface Props {
  icon: any
  title: string
  count: number
  onClick: () => void
}

const EntityCard: React.FunctionComponent<Props> = props => {
  const styles = useStyles()

  return (
    <Card className={styles.card} variant="outlined" onClick={props.onClick}>
      <CardActionArea>
        <CardContent className={styles.header}>
          {props.icon}
          <Typography variant="h5" component="p" className={styles.headerText}>
            {props.title}
          </Typography>
          <Typography variant="h3" component="p">
            <CountUp end={props.count} />
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default EntityCard
