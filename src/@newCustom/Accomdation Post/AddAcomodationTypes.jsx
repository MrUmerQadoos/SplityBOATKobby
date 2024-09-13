'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

// Vars
const initialData = {
  postTitle: 'Nature'
}

const AddAcomodationTypes = () => {
  // States
  const [formData, setFormData] = useState(initialData)

  const handleFormChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
  }

  return (
    <Card>
      <CardContent className='mbe-2'>
        <div className='flex max-sm:flex-col items-center gap-6'>
          <h2>Add Accommodation:</h2>
        </div>
      </CardContent>
      <CardContent>
        <form onSubmit={e => e.preventDefault()}>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={12}>
              <TextField
                fullWidth
                label={`Accommodation Name`}
                placeholder={`Enter Accommodation`}
                onChange={e => handleFormChange('category', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} className='flex gap-4 flex-wrap justify-end'>
              <Button variant='contained' type='submit'>
                Submit
              </Button>
              <Button variant='outlined' type='reset' color='secondary' onClick={() => setFormData(initialData)}>
                Reset
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default AddAcomodationTypes
