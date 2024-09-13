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

const AllItinerary = () => {
  const theme = useTheme() // Get the current theme for dark/light mode
  const router = useRouter()
  const [itineraries, setItineraries] = useState([])
  const [open, setOpen] = useState(false)
  const [selectedItineraryId, setSelectedItineraryId] = useState(null)
  const [loading, setLoading] = useState(false) // Loader state for modal
  const [dataLoading, setDataLoading] = useState(true) // Loader state for data

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const response = await axios.get('/api/itinerary')
        setItineraries(response.data.itineraries)
      } catch (error) {
        console.error('Error fetching itineraries:', error)
      } finally {
        setDataLoading(false) // Stop data loading after fetch
      }
    }

    fetchItineraries()
  }, [])

  const handleEdit = id => {
    router.push(`/edit-itinerary/${id}`)
  }

  const handleOpenModal = id => {
    setSelectedItineraryId(id)
    setOpen(true)
  }

  const handleCloseModal = () => {
    if (!loading) {
      // Prevent closing the modal while loading
      setOpen(false)
      setSelectedItineraryId(null)
    }
  }

  const handleConfirmDelete = async () => {
    setLoading(true) // Start the loader for delete operation
    try {
      await axios.delete(`/api/itinerary/${selectedItineraryId}`)
      setItineraries(itineraries.filter(itinerary => itinerary.id !== selectedItineraryId))
      toast.success('Itinerary deleted successfully')
    } catch (error) {
      console.error('Error deleting itinerary:', error)
      toast.error('Failed to delete itinerary')
    } finally {
      setLoading(false) // Stop the loader
      handleCloseModal()
    }
  }

  return (
    <>
      <Grid container spacing={3}>
        {dataLoading ? (
          <SkeletonList /> // Show skeleton while loading data
        ) : (
          itineraries.map(itinerary => (
            <Grid item xs={12} sm={6} md={4} key={itinerary.id}>
              <Card
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                  transition: 'transform 0.2s',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                  backgroundColor: theme.palette.mode === 'dark' ? '#37334C' : '#fff', // Adjust background for dark mode
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
                    src={itinerary.images[0]?.url || 'https://via.placeholder.com/150'}
                    alt={itinerary.title}
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
                      marginBottom: '16px',
                      color: theme.palette.mode === 'dark' ? '#fff' : '#000' // Adjust text color for dark mode
                    }}
                  >
                    {itinerary.title}
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
                      onClick={() => handleEdit(itinerary.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant='contained'
                      color='error'
                      sx={{ flexGrow: 1 }}
                      onClick={() => handleOpenModal(itinerary.id)}
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
            backgroundColor: theme.palette.mode === 'dark' ? '#424242' : '#fff' // Background for dark mode
          }
        }}
      >
        <DialogTitle
          id='alert-dialog-title'
          sx={{
            fontWeight: 'bold',
            color: theme.palette.mode === 'dark' ? '#fff' : '#37334C' // Text color for dark mode
          }}
        >
          {'Confirm Deletion'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id='alert-dialog-description'
            sx={{
              color: theme.palette.mode === 'dark' ? '##37334C' : '##37334C' // Text color for dark mode
            }}
          >
            Are you sure you want to delete this itinerary? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseModal}
            sx={{ color: theme.palette.mode === 'dark' ? '##37334C' : '##37334C', marginRight: '8px' }}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color='error'
            variant='contained'
            sx={{ color: '#fff' }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color='inherit' /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      <Toaster />
    </>
  )
}

export default AllItinerary
