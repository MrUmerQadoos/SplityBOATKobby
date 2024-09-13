'use client'

import { useState, useEffect, useRef } from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Skeleton from '@mui/material/Skeleton'
import SliderWithBanner from '@/@customumer/sliders/SliderWithBanner'
import axios from 'axios'
import { toast } from 'react-hot-toast'

const AccomDescSlider = () => {
  const [imageUrls, setImageUrls] = useState([]) // Holds the current URLs of the images
  const [newImages, setNewImages] = useState([]) // Holds new images to be added
  const [deletedImages, setDeletedImages] = useState([]) // Holds images to be deleted
  const [isLoading, setIsLoading] = useState(false) // Loading state for fetching images
  const [isSaving, setIsSaving] = useState(false) // Loading state for saving images
  const sliderRef = useRef(null) // Reference to the slider component

  // Fetch images on component mount
  useEffect(() => {
    const fetchImages = async () => {
      setIsLoading(true)
      try {
        const response = await axios.get('/api/AccomDescSlider') // API call to fetch existing images
        if (response.status === 200) {
          console.log('Fetched Images:', response.data.slider) // Log fetched images
          setImageUrls(response.data.slider.map(img => img.url)) // Set fetched images to state
        } else {
          toast.error('Failed to fetch images') // Show error toast if fetch fails
        }
      } catch (error) {
        toast.error('Error fetching images')
        console.error('Fetch Images Error:', error)
      } finally {
        setIsLoading(false) // Stop loading
      }
    }

    fetchImages() // Call fetchImages on component mount
  }, [])

  // Handle saving of images
  const handleSave = async () => {
    if (!sliderRef.current.validateImages()) {
      return // Validate images before saving
    }

    setIsSaving(true) // Start saving
    try {
      // Remove duplicates from bannerSlider
      const uniqueUrls = Array.from(new Set(imageUrls))

      // Get newly added images
      const addedImages = newImages.filter(url => uniqueUrls.includes(url))

      // Get removed images
      const removedImages = uniqueUrls.filter(url => !imageUrls.includes(url))

      // Construct payload with unique URLs
      const payload = {
        bannerSlider: uniqueUrls.map(url => ({ url })),
        deletedImages: removedImages
      }

      console.log('Saving Images:', payload) // Log the images being saved

      const response = await axios.post('/api/AccomDescSlider', payload)

      if (response.status === 200) {
        toast.success('Images saved successfully!') // Show success toast
        setNewImages([]) // Clear new images after successful save
        setDeletedImages([]) // Clear deleted images after successful save
      } else {
        toast.error('Failed to save images') // Show error toast if save fails
      }
    } catch (error) {
      toast.error('Error saving images')
      console.error('Save Images Error:', error)
    } finally {
      setIsSaving(false) // Stop saving
    }
  }

  const handleImageUpload = uploadedUrls => {
    // Determine which images were added or removed
    const newImages = uploadedUrls.filter(url => !imageUrls.includes(url))
    const removedImages = imageUrls.filter(url => !uploadedUrls.includes(url))

    console.log('Uploaded URLs:', uploadedUrls) // Log the uploaded URLs
    console.log('New Images:', newImages) // Log new images
    console.log('Removed Images:', removedImages) // Log removed images

    // Update state with uploaded images
    setImageUrls(uploadedUrls)
    setNewImages(newImages)
    setDeletedImages(removedImages)
  }

  return (
    <Card className='p-10'>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container justifyContent='flex-start'>
            <Typography variant='h4' align='left' style={{ marginBottom: '20px' }}>
              Edit Destination Accommodation Sliders
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          {isLoading ? (
            <Skeleton variant='rectangular' width='100%' height={300} /> // Use Skeleton while loading
          ) : (
            <SliderWithBanner ref={sliderRef} imageUrls={imageUrls} onUpload={handleImageUpload} /> // Render the slider with add button
          )}
        </Grid>
        <Grid item xs={12}>
          <Grid container justifyContent='flex-end'>
            <Button
              variant='contained'
              color='primary'
              style={{ marginTop: '20px' }}
              onClick={handleSave}
              disabled={isSaving} // Disable button while saving
            >
              {isSaving ? <CircularProgress size={24} color='inherit' /> : 'Save'}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  )
}

export default AccomDescSlider
