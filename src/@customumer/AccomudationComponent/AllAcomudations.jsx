'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from '@mui/material/styles'
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress
} from '@mui/material'
import toast, { Toaster } from 'react-hot-toast'
import axios from 'axios'
import Skeleton from '@mui/material/Skeleton'

// SkeletonList Component
const SkeletonList = () => (
  <Grid container spacing={3}>
    {[...Array(6)].map((_, index) => (
      <Grid item xs={12} sm={6} md={4} key={index}>
        <Card
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
            transition: 'transform 0.2s',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 6px 25px rgba(0, 0, 0, 0.15)'
            }
          }}
        >
          <CardContent
            sx={{
              padding: '16px',
              textAlign: 'center'
            }}
          >
            <Skeleton variant='rectangular' width='100%' height='150px' sx={{ marginBottom: '16px' }} />
            <Skeleton variant='text' width='60%' sx={{ marginBottom: '16px' }} />
            <Skeleton variant='text' width='80%' />
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
)

const AccommodationsList = () => {
  const theme = useTheme()
  const router = useRouter()
  const [accommodations, setAccommodations] = useState([])
  const [open, setOpen] = useState(false)
  const [selectedAccommodationId, setSelectedAccommodationId] = useState(null)
  const [loading, setLoading] = useState(true) // Initial loader for skeleton
  const [deleting, setDeleting] = useState(false) // Loader for the delete button

  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        const response = await axios.get('/api/accomudation')
        setAccommodations(response.data.accommodations)
      } catch (error) {
        console.error('Error fetching accommodations:', error)
      } finally {
        setLoading(false) // Data has been fetched, hide skeleton
      }
    }

    fetchAccommodations()
  }, [])

  const handleEdit = id => {
    router.push(`/edit-accommodation/${id}`)
  }

  const handleOpenModal = id => {
    setSelectedAccommodationId(id)
    setOpen(true)
  }

  const handleCloseModal = () => {
    if (!deleting) {
      setOpen(false)
      setSelectedAccommodationId(null)
    }
  }

  const handleConfirmDelete = async () => {
    setDeleting(true) // Show loader on delete button
    try {
      await axios.delete(`/api/accomudation/${selectedAccommodationId}`)
      setAccommodations(accommodations.filter(acc => acc.id !== selectedAccommodationId))
      toast.success('Accommodation deleted successfully')
    } catch (error) {
      console.error('Error deleting accommodation:', error)
      toast.error('Failed to delete accommodation')
    } finally {
      setDeleting(false) // Stop loader
      handleCloseModal()
    }
  }

  return (
    <>
      <Grid container spacing={3}>
        {loading ? (
          <SkeletonList /> // Show skeleton while loading data
        ) : (
          accommodations.map(accommodation => (
            <Grid item xs={12} sm={6} md={4} key={accommodation.id}>
              <Card
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                  transition: 'transform 0.2s',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 6px 25px rgba(0, 0, 0, 0.15)'
                  }
                }}
              >
                <CardContent
                  sx={{
                    padding: '16px',
                    textAlign: 'center'
                  }}
                >
                  <img
                    src={accommodation.images[0]?.url || 'https://via.placeholder.com/150'}
                    alt={accommodation.name}
                    style={{
                      width: '100%',
                      height: '150px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      marginBottom: '16px'
                    }}
                  />
                  <Typography
                    variant='h6'
                    sx={{
                      fontWeight: 'bold',
                      marginBottom: '16px'
                    }}
                  >
                    {accommodation.title}
                  </Typography>
                  <div
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      width: '100%'
                    }}
                  >
                    <Button
                      variant='contained'
                      color='primary'
                      sx={{ marginRight: '8px', flexGrow: 1 }}
                      onClick={() => handleEdit(accommodation.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant='contained'
                      color='error'
                      sx={{ flexGrow: 1 }}
                      onClick={() => handleOpenModal(accommodation.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Confirmation Modal */}
      <Dialog
        open={open}
        onClose={handleCloseModal}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        PaperProps={{
          sx: {
            borderRadius: '12px',
            padding: '16px',
            backgroundColor: theme.palette.mode === 'dark' ? '#424242' : '#fff'
          }
        }}
      >
        <DialogTitle
          id='alert-dialog-title'
          sx={{
            fontWeight: 'bold',
            color: theme.palette.mode === 'dark' ? '#fff' : '##37334C'
          }}
        >
          {'Confirm Deletion'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id='alert-dialog-description'
            sx={{
              color: theme.palette.mode === 'dark' ? '##37334Cd' : '##37334C'
            }}
          >
            Are you sure you want to delete this accommodation? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseModal}
            sx={{ color: theme.palette.mode === 'dark' ? '##37334C' : '##37334C', marginRight: '8px' }}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color='error'
            variant='contained'
            sx={{ color: '#fff' }}
            disabled={deleting}
          >
            {deleting ? <CircularProgress size={24} color='inherit' /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      <Toaster />
    </>
  )
}

export default AccommodationsList
