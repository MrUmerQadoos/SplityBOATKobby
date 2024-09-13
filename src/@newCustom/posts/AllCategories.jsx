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

const AllCategories = () => {
  const [categories, setCategories] = useState([])
  const [name, setName] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false) // Loading state

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')

        const data = await response.json()

        setCategories(data)
      } catch (err) {
        console.error('Error fetching categories:', err)
      }
    }

    fetchCategories()
  }, [])

  const handleSubmit = async event => {
    event.preventDefault()

    setLoading(true) // Start loading

    const formData = new FormData()

    formData.append('name', name)

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (response.ok) {
        console.log('Category added:', result)

        setCategories([...categories, result])
        setName('')
      } else {
        setError(result.error)
        console.error(result.error)
      }
    } catch (error) {
      console.error('Error adding category:', error)
    } finally {
      setLoading(false) // Stop loading
    }
  }

  const handleDelete = async id => {
    try {
      const response = await fetch(`/api/categories/${id}`, { method: 'DELETE' })
      const result = await response.json()

      if (response.ok) {
        setCategories(categories.filter(category => category.id !== id))
      } else {
        console.error(result.error)
      }
    } catch (error) {
      console.error('Error deleting category:', error)
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
                  label='Activity Name'
                  variant='outlined'
                  fullWidth
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={3} md={2}>
                <Button variant='contained' color='primary' type='submit' disabled={loading}>
                  {loading ? <CircularProgress size={24} color='inherit' /> : 'Add '}
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
                  <TableCell className='font-bold uppercase text-[18px]'>All Activities</TableCell>
                  <TableCell align='right' className='font-bold uppercase text-[18px]'>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.map(category => (
                  <TableRow key={category.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component='th' scope='row' className='flex items-center gap-2 font-bold text-[16px]'>
                      {category.name}
                    </TableCell>
                    <TableCell align='right'>
                      <div className='flex gap-2 justify-end'>
                        <Button variant='outlined' color='error' onClick={() => handleDelete(category.id)}>
                          Delete
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

export default AllCategories
