import React from 'react'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

import { useStyles } from './styles'

interface Props {
  onYes: () => Promise<void>
  onNo: () => void
  submiting: boolean
  submitingText: string
}

const Confirm: React.FunctionComponent<Props> = ({
  onYes,
  onNo,
  submiting,
  submitingText
}) => {
  const styles = useStyles()

  return (
    <div className={styles.container}>
      <Typography variant="body2">
        {submiting
          ? `${submitingText}`
          : 'Are you sure to perform this action?'}
      </Typography>
      <div className={styles.buttonPanel}>
        <Button variant="outlined" onClick={onNo}>
          No
        </Button>
        <Button variant="contained" color="primary" onClick={onYes}>
          {submiting ? '...' : 'Yes'}
        </Button>
      </div>
    </div>
  )
}

export default Confirm
