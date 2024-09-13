'use client'

import { useEffect, useState } from 'react'

import { Button, Grid, TextField, Typography, CircularProgress } from '@mui/material'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

const AllAccommodationType = () => {
  const [accommodationTypes, setAccommodationTypes] = useState([])
  const [name, setName] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false) // Loading state for the add operation
  const [deletingId, setDeletingId] = useState(null) // Track which item is being deleted

  useEffect(() => {
    const fetchAccommodationTypes = async () => {
      try {
        const response = await fetch('/api/accomodationType')

        const data = await response.json()

        setAccommodationTypes(data)
      } catch (err) {
        console.error('Error fetching accommodation types:', err)
      }
    }

    fetchAccommodationTypes()
  }, [])

  const handleSubmit = async event => {
    event.preventDefault()

    setLoading(true) // Start loading

    const formData = new FormData()

    formData.append('name', name)

    try {
      const response = await fetch('/api/accomodationType', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (response.ok) {
        console.log('Accommodation type added:', result)

        setAccommodationTypes([...accommodationTypes, result])
        setName('')
      } else {
        setError(result.error)
        console.error(result.error)
      }
    } catch (error) {
      console.error('Error adding accommodation type:', error)
    } finally {
      setLoading(false) // Stop loading
    }
  }

  const handleDelete = async id => {
    setDeletingId(id) // Set the id of the item being deleted

    try {
      const response = await fetch(`/api/accomodationType/${id}`, { method: 'DELETE' })
      const result = await response.json()

      if (response.ok) {
        setAccommodationTypes(accommodationTypes.filter(type => type.id !== id))
      } else {
        console.error(result.error)
      }
    } catch (error) {
      console.error('Error deleting accommodation type:', error)
    } finally {
      setDeletingId(null) // Reset the deleting id after the operation is complete
    }
  }

  return (
    <div className='shadow-lg px-6 py-6 rounded-md'>
      <Grid container spacing={6}>
        <Grid item xs={12} md={12}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={12} alignItems='center'>
              <Grid item xs={9} md={10}>
                <TextField
                  label='Accommodation Type Name'
                  variant='outlined'
                  fullWidth
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={3} md={2}>
                <Button variant='contained' color='primary' type='submit' disabled={loading}>
                  {loading ? <CircularProgress size={24} color='inherit' /> : 'Add'}
                </Button>
              </Grid>
            </Grid>
            {error && <Typography color='error'>{error}</Typography>}
          </form>
        </Grid>
        <Grid item xs={12} md={12}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label='simple table'>
              <TableHead>
                <TableRow>
                  <TableCell className='font-bold uppercase text-[18px]'>All Accommodation Types</TableCell>
                  <TableCell align='right' className='font-bold uppercase text-[18px]'>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {accommodationTypes.map(type => (
                  <TableRow key={type.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component='th' scope='row' className='flex items-center gap-2 font-bold text-[16px]'>
                      {type.name}
                    </TableCell>
                    <TableCell align='right'>
                      <div className='flex gap-2 justify-end'>
                        <Button
                          variant='outlined'
                          color='error'
                          onClick={() => handleDelete(type.id)}
                          disabled={deletingId === type.id} // Disable the button if the item is being deleted
                        >
                          {deletingId === type.id ? <CircularProgress size={24} color='inherit' /> : 'Delete'}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </div>
  )
}

export default AllAccommodationType
