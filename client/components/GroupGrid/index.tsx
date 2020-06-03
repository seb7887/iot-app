import React from 'react'

import GroupCard from './GroupCard'
import { useStyles } from './styles'

interface Props {
  groups: Group[]
}

const GroupGrid: React.FunctionComponent<Props> = ({ groups }) => {
  const styles = useStyles()

  return (
    <div className={styles.gridList}>
      {groups.map(group => (
        <GroupCard key={group.id} group={group} />
      ))}
    </div>
  )
}

export default GroupGrid
