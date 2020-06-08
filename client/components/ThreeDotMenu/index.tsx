import React from 'react'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import IconButton from '@material-ui/core/IconButton'

import { useStyles } from './styles'

interface ThreeDotMenuListItem {
  label: string
  action: () => void | Promise<void>
  disabled?: boolean
}

interface Props {
  menu: ThreeDotMenuListItem[]
}

const ThreeDotMenu: React.FunctionComponent<Props> = props => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const styles = useStyles()

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const actionClick = (index: number) => {
    props.menu[index].action()
    handleClose()
  }

  return (
    <>
      <IconButton
        aria-controls="more-options"
        color="primary"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {props.menu &&
          props.menu.map((item, index) => (
            <MenuItem
              key={index}
              onClick={() => actionClick(index)}
              className={styles.menuItem}
              disabled={item.disabled || false}
            >
              {item.label}
            </MenuItem>
          ))}
      </Menu>
    </>
  )
}

export default ThreeDotMenu
