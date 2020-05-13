import React from 'react'
import clsx from 'clsx'
import AppBar from '@material-ui/core/AppBar'

import { useStyles } from './style'

const Layout: React.FunctionComponent = props => {
  const styles = useStyles()

  return (
    <div className={styles.root}>
      <AppBar
        position="fixed"
        color="transparent"
        className={clsx(styles.appBar, {
          [styles.appBarShift]: open
        })}
      >
        <h6>IoT</h6>
      </AppBar>
      {props.children}
    </div>
  )
}

export default Layout
