'use client'

import { useState } from 'react'

import Grid from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'

const AboutPage = () => {
  const [socialLinks, setSocialLinks] = useState({
    email: '',
    phone: '',
    instagram: '',
    facebook: '',
    youtube: ''
  })

  const [about, setAbout] = useState('')
  const [openingTimes, setOpeningTimes] = useState([])
  const [locations, setLocations] = useState([''])

  const [openingTime, setOpeningTime] = useState('')
  const [closingTime, setClosingTime] = useState('')

  const [openingMonth, setOpeningMonth] = useState('')
  const [amPm, setAmPm] = useState('AM')

  const handleSocialLinkChange = e => {
    setSocialLinks({ ...socialLinks, [e.target.name]: e.target.value })
  }

  const handleAboutChange = e => {
    setAbout(e.target.value)
  }

  const handleLocationChange = (index, value) => {
    const newLocations = [...locations]

    newLocations[index] = value

    setLocations(newLocations)
  }

  const addLocation = () => {
    setLocations([...locations, ''])
  }

  const removeLocation = index => {
    const newLocations = locations.filter((_, i) => i !== index)

    setLocations(newLocations)
  }

  const handleAddOpeningTime = () => {
    if (openingTime && openingMonth && closingTime) {
      const combinedOpeningTime = `${openingTime} ${amPm}`
      const combinedClosingTime = `${closingTime} ${amPm}`

      const newOpeningTime = `${combinedOpeningTime} - ${combinedClosingTime} (${openingMonth})`

      setOpeningTimes([...openingTimes, newOpeningTime])

      setOpeningTime('')
      setClosingTime('')
      setOpeningMonth('')

      setAmPm('AM')
    }
  }

  const handleRemoveOpeningTime = index => {
    const newOpeningTimes = openingTimes.filter((_, i) => i !== index)

    setOpeningTimes(newOpeningTimes)
  }

  const handleSubmit = () => {
    // Handle form submission here
    console.log({ socialLinks, about, openingTimes, locations })
  }

  return (
    <Card className='mbe-5 p-12'>
      <Typography variant='h4' gutterBottom className='mb-4'>
        About Us
      </Typography>

      <Card
        variant='outlined'
        sx={{ shadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)', marginBottom: '20px' }}
        className='shadow-lg'
      >
        <CardContent>
          <Typography variant='h6' gutterBottom>
            Social Media Links
          </Typography>
          <Grid container spacing={2}>
            {Object.keys(socialLinks).map(key => (
              <Grid item xs={12} sm={6} key={key}>
                <TextField
                  name={key}
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  variant='outlined'
                  fullWidth
                  margin='normal'
                  value={socialLinks[key]}
                  onChange={handleSocialLinkChange}
                />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      <Card
        variant='outlined'
        sx={{ shadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)', marginBottom: '20px' }}
        className='shadow-lg'
      >
        <CardContent>
          <Typography variant='h6' gutterBottom>
            About
          </Typography>
          <TextField
            multiline
            rows={4}
            variant='outlined'
            fullWidth
            margin='normal'
            placeholder='Write about us...'
            value={about}
            onChange={handleAboutChange}
          />
        </CardContent>
      </Card>

      {/* Opening Times Card */}
      <Card
        variant='outlined'
        sx={{ shadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)', marginBottom: '20px' }}
        className='shadow-lg'
      >
        <CardContent>
          <Typography variant='h6' className='mb-6'>
            Add Opening Times
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} lg={4}>
              <TextField
                fullWidth
                label='Starting Time'
                placeholder='e.g. 08:00'
                type='text'
                value={openingTime}
                onChange={e => setOpeningTime(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <Select
                        className='mt-6 mb-6'
                        value={amPm}
                        onChange={e => setAmPm(e.target.value)}
                        displayEmpty
                        inputProps={{ 'aria-label': 'AM/PM' }}
                        sx={{
                          width: '100px',
                          height: '40px',
                          fontSize: '0.75rem' // Adjust font size if needed
                        }}
                      >
                        <MenuItem value='AM'>AM</MenuItem>
                        <MenuItem value='PM'>PM</MenuItem>
                      </Select>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={4}>
              <TextField
                fullWidth
                label='Ending Time'
                placeholder='e.g. 08:00'
                type='text'
                value={closingTime}
                onChange={e => setClosingTime(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <Select
                        className='mt-6 mb-6'
                        value={amPm}
                        onChange={e => setAmPm(e.target.value)}
                        displayEmpty
                        inputProps={{ 'aria-label': 'AM/PM' }}
                        sx={{
                          width: '100px',
                          height: '40px',
                          fontSize: '0.75rem' // Adjust font size if needed
                        }}
                      >
                        <MenuItem value='AM'>AM</MenuItem>
                        <MenuItem value='PM'>PM</MenuItem>
                      </Select>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            <Grid item xs={12} sm={12} lg={4}>
              <Select fullWidth value={openingMonth} onChange={e => setOpeningMonth(e.target.value)}>
                {Array.from({ length: 12 }, (_, i) => (
                  <MenuItem key={i} value={i + 1}>
                    {new Date(0, i).toLocaleString('default', { month: 'long' })}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
          <Grid item xs={12} className='flex justify-end mt-4'>
            <Button variant='contained' onClick={handleAddOpeningTime}>
              Add Time
            </Button>
          </Grid>
          <Typography variant='h6' className='mt-6'>
            Current Times
          </Typography>
          {openingTimes.length > 0 ? (
            <List>
              {openingTimes.map((time, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <IconButton edge='end' aria-label='delete' onClick={() => handleRemoveOpeningTime(index)}>
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText primary={time} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant='body2'>No opening times added yet.</Typography>
          )}
        </CardContent>
      </Card>

      <Card
        variant='outlined'
        sx={{ shadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)', marginBottom: '20px' }}
        className='shadow-lg'
      >
        <CardContent>
          <Typography variant='h6' gutterBottom>
            Locations
          </Typography>
          {locations.map((location, index) => (
            <Grid container spacing={2} key={index} className='mb-4'>
              <Grid item xs={10}>
                <TextField
                  fullWidth
                  label={`Location ${index + 1}`}
                  variant='outlined'
                  value={location}
                  onChange={e => handleLocationChange(index, e.target.value)}
                />
              </Grid>
              <Grid item xs={2} className='flex items-center justify-center'>
                {locations.length > 1 && (
                  <IconButton onClick={() => removeLocation(index)} color='error'>
                    <DeleteIcon />
                  </IconButton>
                )}
              </Grid>
            </Grid>
          ))}

          <Grid item xs={12} className='flex justify-end mt-4'>
            <Button variant='contained' onClick={addLocation}>
              Add Location
            </Button>
          </Grid>
        </CardContent>
      </Card>

      <Button variant='contained' color='primary' onClick={handleSubmit}>
        Submit
      </Button>
    </Card>
  )
}

export default AboutPage
