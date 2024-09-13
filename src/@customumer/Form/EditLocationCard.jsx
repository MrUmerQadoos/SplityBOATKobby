import React from 'react'
import { Grid, Card, CardContent, Typography, TextField, Button, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { LoadScript, Autocomplete } from '@react-google-maps/api'

const EditLocationCard = ({
  locations,
  setLocations,
  autocompleteRefs,
  addLocation,
  removeLocation,
  handleLocationChange,
  handlePlaceChanged,
  saveAllLocations
}) => {
  const updateAutocompleteRefs = (index, autocomplete) => {
    autocompleteRefs.current[index] = autocomplete
  }

  return (
    <Card variant='outlined' sx={{ padding: '16px' }}>
      <CardContent>
        <Typography variant='h6' className='mb-4'>
          Locations
        </Typography>
        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY} libraries={['places']}>
          {locations.map((location, index) => (
            <Grid container spacing={2} key={index} className='mb-4 align-items-center'>
              <Grid item xs={7}>
                <Autocomplete
                  onLoad={autocomplete => updateAutocompleteRefs(index, autocomplete)}
                  onPlaceChanged={() => handlePlaceChanged(index)}
                >
                  <TextField
                    fullWidth
                    label={`Location ${index + 1}`}
                    variant='outlined'
                    value={location.address}
                    onChange={e => handleLocationChange(index, e)}
                    disabled={location.added}
                    InputProps={{
                      style: {
                        backgroundColor: location.added ? '#f5f5f5' : '#fff'
                      }
                    }}
                  />
                </Autocomplete>
              </Grid>
              <Grid item xs={3} className='flex items-center justify-center'>
                {!location.added && (
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={() => addLocation(index)}
                    disabled={location.lat === null || location.lng === null}
                    sx={{ width: '70%' }}
                  >
                    Add Location
                  </Button>
                )}
              </Grid>
              <Grid item xs={2} className='flex items-center justify-center'>
                {location.added && (
                  <IconButton onClick={() => removeLocation(index)} color='error'>
                    <DeleteIcon />
                  </IconButton>
                )}
              </Grid>
            </Grid>
          ))}
          <Grid item xs={12} className='flex justify-end mt-4'>
            <Button variant='contained' color='primary' onClick={saveAllLocations}>
              Save All Locations
            </Button>
          </Grid>
        </LoadScript>
      </CardContent>
    </Card>
  )
}

export default EditLocationCard
