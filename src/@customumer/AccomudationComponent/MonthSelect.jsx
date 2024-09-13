import * as React from 'react'

import { useTheme } from '@mui/material/styles'

import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'

import Select from '@mui/material/Select'

const ITEM_HEIGHT = 48

const ITEM_PADDING_TOP = 8

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
}

// List of months or other items
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

export default function MonthSelect({ openingMonth, setOpeningMonth }) {
  const theme = useTheme()

  return (
    <FormControl fullWidth sx={{ m: 1, minWidth: 120 }}>
      <InputLabel id='month-select-label'>Month</InputLabel>
      <Select
        labelId='month-select-label'
        id='month-select'
        value={openingMonth}
        onChange={e => setOpeningMonth(e.target.value)}
        label='Month'
        MenuProps={MenuProps}
      >
        {months.map(month => (
          <MenuItem key={month} value={month}>
            {month}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
