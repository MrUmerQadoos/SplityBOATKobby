import React from 'react'
import { Grid, Card, CardContent, Typography, TextField, Button, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { LoadScript, Autocomplete } from '@react-google-maps/api'

const AddLocationCard = ({
  locations,
  setLocations,
  autocompleteRefs,
  setAutocompleteRefs,
  addLocation,
  removeLocation,
  handleLocationChange,
  handlePlaceChanged,
  handleSuggestionClick,
  saveAllLocations
}) => {
  const handleRemoveLocation = index => {
    if (index >= 0 && index < locations.length) {
      const updatedLocations = locations.filter((_, i) => i !== index)
      const updatedRefs = autocompleteRefs.filter((_, i) => i !== index)

      setLocations(updatedLocations)
      setAutocompleteRefs(updatedRefs)

      // Ensure at least one location input is available
      if (updatedLocations.length === 0) {
        setLocations([{ address: '', lat: null, lng: null, suggestions: [], added: false }])
        setAutocompleteRefs([])
      }
    }
  }

  const addNewLocation = index => {
    const updatedLocations = [...locations]

    // Mark the current location as added
    updatedLocations[index].added = true
    updatedLocations[index].suggestions = []

    // Add a new empty location field
    updatedLocations.push({ address: '', lat: null, lng: null, suggestions: [], added: false })

    setLocations(updatedLocations)

    // Also ensure autocompleteRefs is updated to maintain the correct length
    setAutocompleteRefs(prevRefs => [...prevRefs, null])
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
              <Grid item xs={7} sx={{ position: 'relative' }}>
                <Autocomplete
                  onLoad={autocomplete => {
                    const updatedRefs = [...autocompleteRefs]
                    updatedRefs[index] = autocomplete
                    setAutocompleteRefs(updatedRefs)
                  }}
                  onPlaceChanged={() => handlePlaceChanged(index)}
                >
                  <TextField
                    fullWidth
                    label={`Location ${index + 1}`}
                    variant='outlined'
                    value={location.address}
                    onChange={e => handleLocationChange(index, e)}
                    disabled={location.added}
                  />
                </Autocomplete>

                {Array.isArray(location.suggestions) && location.suggestions.length > 0 && (
                  <ul
                    className='suggestions-dropdown'
                    style={{
                      position: 'absolute',
                      zIndex: 10,
                      backgroundColor: '#fff',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      width: '100%',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                      marginTop: '4px',
                      paddingLeft: '0',
                      listStyleType: 'none',
                      maxHeight: '200px',
                      overflowY: 'auto'
                    }}
                  >
                    {location.suggestions.map((suggestion, i) => (
                      <li
                        key={i}
                        onClick={() => handleSuggestionClick(index, suggestion)}
                        className='suggestion-item'
                        style={{
                          padding: '10px',
                          cursor: 'pointer',
                          backgroundColor: i % 2 === 0 ? '#fafafa' : '#fff',
                          borderBottom: '1px solid #eee'
                        }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = i % 2 === 0 ? '#fafafa' : '#fff')}
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                )}
              </Grid>
              <Grid item xs={3} className='flex items-center justify-center'>
                {!location.added && (
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={() => addNewLocation(index)}
                    disabled={location.lat === null || location.lng === null}
                    sx={{ width: '70%' }}
                  >
                    Add
                  </Button>
                )}
              </Grid>
              <Grid item xs={2} className='flex items-center justify-center'>
                {location.added && (
                  <IconButton onClick={() => handleRemoveLocation(index)} color='error'>
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

export default AddLocationCard
