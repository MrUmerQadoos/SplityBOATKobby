import React from 'react'
import toast from 'react-hot-toast'

import {
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  List,
  ListItem,
  ListItemText
} from '@mui/material'

import dayjs from 'dayjs'

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import DeleteIcon from '@mui/icons-material/Delete'

const OpeningTimes = ({
  formData,
  setFormData,
  handleRemove,
  openingTime,
  setOpeningTime,
  closingTime,
  setClosingTime,
  openingAmPm,
  setOpeningAmPm,
  closingAmPm,
  setClosingAmPm,
  handleAddOpeningTime,
  openingMonth,
  setOpeningMonth,
  closingMonth,
  setClosingMonth
}) => {
  const handleTimeChange = setter => e => {
    const value = e.target.value
    if (/^[0-9:]*$/.test(value)) {
      setter(value)
    } else {
      toast.error('Please enter a valid time (numbers only).')
    }
  }

  return (
    <Card variant='outlined'>
      <CardContent>
        <Typography variant='h6' className='mb-10'>
          Add Opening Times
        </Typography>
        <Grid container spacing={2}>
          {/* Starting Time */}
          <Grid container className='' spacing={1}>
            <Grid tem xs={12} sm={6} className='p-2'>
              <TextField
                fullWidth
                label='Starting Time'
                placeholder='e.g. 08:00'
                type='text'
                value={openingTime}
                onChange={handleTimeChange(setOpeningTime)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <Select
                        value={openingAmPm}
                        onChange={e => setOpeningAmPm(e.target.value)}
                        sx={{ width: '80px', height: '40px', fontSize: '0.75rem' }}
                      >
                        <MenuItem value='AM'>AM</MenuItem>
                        <MenuItem value='PM'>PM</MenuItem>
                      </Select>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            {/* Ending Time */}
            <Grid tem xs={12} sm={6} className='p-2'>
              <TextField
                fullWidth
                label='Ending Time'
                placeholder='e.g. 05:00'
                type='text'
                value={closingTime}
                onChange={handleTimeChange(setClosingTime)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <Select
                        value={closingAmPm}
                        onChange={e => setClosingAmPm(e.target.value)}
                        sx={{ width: '80px', height: '40px', fontSize: '0.75rem' }}
                      >
                        <MenuItem value='AM'>AM</MenuItem>
                        <MenuItem value='PM'>PM</MenuItem>
                      </Select>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
          </Grid>

          <Grid container spacing={1}>
            {/* Starting Date Picker */}
            <Grid item xs={12} sm={6} className='p-2'>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label='Starting Date'
                  className='w-full'
                  views={['year', 'month', 'day']}
                  onChange={newValue => setOpeningMonth(newValue)}
                  renderInput={params => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>

            {/* Closing Date Picker */}
            <Grid item xs={12} sm={6} className='p-2'>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label='Closing Date'
                  views={['year', 'month', 'day']}
                  className='w-full'
                  onChange={newValue => setClosingMonth(newValue)}
                  renderInput={params => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        </Grid>
        {/* Add Time Button */}
        <Grid item xs={12} className='flex justify-end mt-4'>
          <Button variant='contained' onClick={handleAddOpeningTime}>
            Add Time
          </Button>
        </Grid>

        <Typography variant='h6' className='mt-6'>
          Current Times
        </Typography>
        <List>
          {formData.openingTimes.length > 0 ? (
            formData.openingTimes.map((time, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <IconButton edge='end' onClick={() => handleRemove('openingTimes', index)}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={`${time.openingTime}  - ${time.closingTime} `}
                  secondary={`${time.startMonth ? dayjs(time.startMonth).format('DD/MM/YYYY') : 'N/A'} - ${
                    time.endMonth ? dayjs(time.endMonth).format('DD/MM/YYYY') : 'N/A'
                  }`}
                  // secondary={`${time.startMonth ? time.startMonth.format('DD/MM/YYYY') : 'N/A'} - ${time.endMonth ? time.endMonth.format('DD/MM/YYYY') : 'N/A'}`}
                />
              </ListItem>
            ))
          ) : (
            <Typography variant='body2'>No opening times added yet.</Typography>
          )}
        </List>
      </CardContent>
    </Card>
  )
}

export default OpeningTimes
