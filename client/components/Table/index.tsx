import React from 'react'
import MuiTable from '@material-ui/core/Table'
import MuiTableBody from '@material-ui/core/TableBody'
import MuiTableRow from '@material-ui/core/TableRow'
import MuiTableCell from '@material-ui/core/TableCell'
import MuiTableContainer from '@material-ui/core/TableContainer'
import MuiTableHead from '@material-ui/core/TableHead'
import MuiTableFooter from '@material-ui/core/TableFooter'
import MuiTablePagination from '@material-ui/core/TablePagination'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import Typography from '@material-ui/core/Typography'
import SearchIcon from '@material-ui/icons/Search'

import Loader from '../Loader'
import { useStyles } from './styles'

interface Row {
  id: string
  values: (string | number | null)[]
}

interface Props {
  loading: boolean
  columns: string[]
  rows: Row[]
  count: number
  page: number
  rowsPerPage: number
  searchText: string
  searchPlaceholder: string
  onChangePage: (page: number) => void
  onChangeRowsPerPage: (rowsPerPage: number) => void
  onChangeSearch: (text: string) => void
}

const Table: React.FunctionComponent<Props> = ({
  loading,
  columns,
  rows,
  count,
  page,
  rowsPerPage,
  searchText,
  searchPlaceholder,
  onChangePage,
  onChangeRowsPerPage,
  onChangeSearch
}) => {
  const styles = useStyles()

  const changePage = (e: any, page: number) => {
    e.preventDefault()
    onChangePage(page)
  }

  const changeRowsPerPage = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    e.preventDefault()
    onChangeRowsPerPage(parseInt(e.target.value, 10))
    onChangePage(0)
  }

  const changeSearch = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onChangeSearch(e.target.value)
  }

  const clear = (e: React.SyntheticEvent) => {
    e.preventDefault()
    onChangeSearch('')
  }

  return (
    <MuiTableContainer component={Paper} className={styles.table}>
      {loading && <Loader linear />}
      <div className={styles.searchMenu}>
        <TextField
          value={searchText}
          placeholder={searchPlaceholder}
          onChange={changeSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />
        <Typography
          variant="h6"
          color="primary"
          onClick={clear}
          className={styles.clear}
        >
          Clear
        </Typography>
      </div>
      <MuiTable aria-label="table">
        <MuiTableHead className={styles.header}>
          {columns.map(column => (
            <MuiTableCell align="right">{column}</MuiTableCell>
          ))}
        </MuiTableHead>
        <MuiTableBody>
          {rows.map(row => (
            <MuiTableRow key={row.id} className={styles.row}>
              {row.values.map((v, index) => (
                <MuiTableCell align="right" key={`v-${index}`}>
                  {v}
                </MuiTableCell>
              ))}
            </MuiTableRow>
          ))}
        </MuiTableBody>
        <MuiTableFooter>
          <MuiTableRow>
            <MuiTablePagination
              rowsPerPageOptions={[20, 50]}
              rowsPerPage={rowsPerPage}
              page={page}
              count={count}
              onChangePage={changePage}
              onChangeRowsPerPage={changeRowsPerPage}
            />
          </MuiTableRow>
          {loading && <Loader />}
        </MuiTableFooter>
      </MuiTable>
    </MuiTableContainer>
  )
}

export default Table
