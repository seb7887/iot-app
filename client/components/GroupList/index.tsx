import React, { useState } from 'react'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import GroupsIcon from '@material-ui/icons/AccountTreeOutlined'
import SearchIcon from '@material-ui/icons/SearchOutlined'
import ClearIcon from '@material-ui/icons/CloseOutlined'

import Error from '../Error'
import Loader from '../Loader'
import GroupGrid from '../GroupGrid'
import { useStyles } from './styles'

interface Props {
  loading: boolean
  error: string
  groups: Group[]
  onSearch: (text: string) => Promise<void>
  onClear: () => Promise<void>
}

const titles = {
  topLevel: 'TOP-LEVEL GROUPS',
  searchResults: 'SEARCH RESULTS'
}

const GroupList: React.FunctionComponent<Props> = ({
  loading,
  error,
  groups,
  onSearch,
  onClear
}) => {
  const [title, setTitle] = useState<string>(titles.topLevel)
  const [searchText, setSearchText] = useState<string>('')
  const styles = useStyles()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setSearchText(value)
  }

  const handleSearch = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    setTitle(titles.searchResults)
    await onSearch(searchText)
  }

  const handleClear = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    setSearchText('')
    setTitle(titles.topLevel)
    await onClear()
  }

  if (loading) {
    return <Loader message="Loading Groups..." />
  }

  if (!loading && error) {
    return <Error message={error} />
  }

  return (
    <Grid container direction="row" spacing={2} className={styles.container}>
      <Grid item xs={12} className={styles.topLevel}>
        <GroupsIcon className={styles.icon} />
        <Typography component="span">
          <Box
            component="p"
            m={0}
            fontSize="h6.fontSize"
            fontWeight="fontWeightLight"
          >
            {title} <strong>{groups.length}</strong>
          </Box>
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Paper square className={styles.paper} elevation={4}>
          <Typography component="span">
            <Box
              component="p"
              m={0}
              fontSize="h6.fontSize"
              fontWeight="fontWeightLight"
            >
              SEARCH
            </Box>
          </Typography>
          <div className={styles.search}>
            <TextField
              id="search"
              name="searchText"
              value={searchText}
              placeholder="Enter group name"
              onChange={handleChange}
              className={styles.searchTextField}
            />
            <ButtonGroup
              size="large"
              variant="text"
              className={styles.buttonGroup}
            >
              <Button onClick={handleClear}>
                <ClearIcon />
              </Button>
              <Button disabled={searchText === ''} onClick={handleSearch}>
                <SearchIcon />
              </Button>
            </ButtonGroup>
          </div>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <GroupGrid groups={groups} />
      </Grid>
    </Grid>
  )
}

export default GroupList
