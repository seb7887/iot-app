import React from 'react'
import MuiTable from '@material-ui/core/Table'
import MuiTableBody from '@material-ui/core/TableBody'
import MuiTableRow from '@material-ui/core/TableRow'
import MuiTableCell from '@material-ui/core/TableCell'
import MuiTableContainer from '@material-ui/core/TableContainer'
import MuiTableHead from '@material-ui/core/TableHead'
import Paper from '@material-ui/core/Paper'

interface Row {
  id: string
  values: (string | number | null)[]
}

interface Props {
  columns: string[]
  rows: Row[]
}

const Table: React.FunctionComponent<Props> = ({ columns, rows }) => {
  return (
    <MuiTableContainer component={Paper}>
      <MuiTable aria-label="table">
        <MuiTableHead>
          {columns.map(column => (
            <MuiTableCell align="right">{column}</MuiTableCell>
          ))}
        </MuiTableHead>
        <MuiTableBody>
          {rows.map(row => (
            <MuiTableRow key={row.id}>
              {row.values.map((v, index) => (
                <MuiTableCell align="right" key={`v-${index}`}>
                  {v}
                </MuiTableCell>
              ))}
            </MuiTableRow>
          ))}
        </MuiTableBody>
      </MuiTable>
    </MuiTableContainer>
  )
}

export default Table
