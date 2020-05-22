import React from 'react'
import MuiToolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'

import { useStyles } from './styles'

interface Props {
  header?: string
  subheader?: string
  caption?: string
  icon?: React.ClassicElement<{}>
}

const Toolbar: React.FunctionComponent<Props> = props => {
  const styles = useStyles()

  return (
    <MuiToolbar className={styles.toolbar}>
      <div className={styles.toolbarWrapper}>
        {props.icon && props.icon}
        <div className={styles.toolbarHeader}>
          <Typography component="div">
            {props.subheader && (
              <Box fontSize={12} m={1} fontWeight="fontWeightLight">
                {props.subheader}
              </Box>
            )}
            <Box
              fontSize="h5.fontSize"
              m={1}
              fontWeight="fontWeightMedium"
              className={styles.title}
            >
              {props.header}
            </Box>
            {props.caption && (
              <Box fontSize="fontSize" m={1} fontWeight="fontWeightLight">
                {props.caption}
              </Box>
            )}
          </Typography>
        </div>
      </div>
      {props.children && (
        <div className={styles.buttonContainer}>{props.children}</div>
      )}
    </MuiToolbar>
  )
}

export default Toolbar
