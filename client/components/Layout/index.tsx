import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Drawer from '@material-ui/core/Drawer'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import DevicesIcon from '@material-ui/icons/Router'
import UsersIcon from '@material-ui/icons/Person'
import GroupsIcon from '@material-ui/icons/AccountTreeOutlined'
import AdminsIcon from '@material-ui/icons/SupervisorAccount'
import ProfileIcon from '@material-ui/icons/PersonOutline'
import SignOutIcon from '@material-ui/icons/ExitToApp'

import { useAuth } from '../../context'
import { useStyles } from './styles'

interface MenuItem {
  label: string
  icon: JSX.Element
  to: string
  tooltip: string
}

const menu: MenuItem[] = [
  {
    label: 'Devices',
    icon: <DevicesIcon />,
    to: '/devices',
    tooltip: 'Devices'
  },
  {
    label: 'Users',
    icon: <UsersIcon />,
    to: '/users',
    tooltip: 'Users'
  },
  {
    label: 'Groups',
    icon: <GroupsIcon />,
    to: '/groups',
    tooltip: 'Groups'
  },
  {
    label: 'Admins',
    icon: <AdminsIcon />,
    to: '/admins',
    tooltip: 'Admins'
  }
]

const Layout: React.FunctionComponent = props => {
  const { signOut, isAdmin } = useAuth()
  const router = useRouter()
  const styles = useStyles()

  const getMenu = () => {
    if (isAdmin()) {
      return menu
    }
    return menu.slice(0, 2)
  }

  const logout = () => {
    signOut()
    router.push('/')
  }

  return (
    <div className={styles.root}>
      <Drawer
        className={styles.drawer}
        variant="permanent"
        anchor="left"
        PaperProps={{ className: styles.sidebar, elevation: 6 }}
      >
        <Link href="/dashboard">
          <Typography variant="h3" color="primary" className={styles.brand}>
            IoT
          </Typography>
        </Link>
        <Divider classes={{ root: styles.divider }} />
        <List>
          {getMenu().map((item, index) => (
            <Link href={item.to} key={`item-${index}`}>
              <ListItem button key={item.label} className={styles.item}>
                {item.icon && (
                  <ListItemIcon className={styles.icon}>
                    {item.icon}
                  </ListItemIcon>
                )}
                <ListItemText primary={item.label} />
              </ListItem>
            </Link>
          ))}
        </List>
        <div>
          <Divider classes={{ root: styles.divider }} />
          <List>
            <Link href="/my-account">
              <ListItem button className={styles.item}>
                <ListItemIcon className={styles.icon}>
                  <ProfileIcon />
                </ListItemIcon>
                <ListItemText primary="My Account" />
              </ListItem>
            </Link>
            <ListItem button className={styles.item} onClick={logout}>
              <ListItemIcon className={styles.icon}>
                <SignOutIcon />
              </ListItemIcon>
              <ListItemText primary="Sign Out" />
            </ListItem>
          </List>
        </div>
      </Drawer>
      <main className={styles.content}>{props.children}</main>
    </div>
  )
}

export default Layout
