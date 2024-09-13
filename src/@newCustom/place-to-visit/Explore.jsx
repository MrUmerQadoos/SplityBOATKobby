'use client'
// src/components/Explore.js
import { useState } from 'react'
import { Button, Grid, CircularProgress } from '@mui/material'
import { Toaster, toast } from 'react-hot-toast'
import LandscapceCard from '@/@customumer/LandscapceCard'
import PotraitCard from '@/@customumer/PotraitCard'

import useSectionData from '@/hooks/useSectionData'

const Explore = () => {
  const [loading, setLoading] = useState(false)
  const initialCards = [
    { id: 0, image: '', title: '' },
    { id: 1, image: '', title: '' },
    { id: 2, image: '', title: '' },
    { id: 3, image: '', title: '' }
  ]

  const { cards, handleCardChange, handleSubmit } = useSectionData('explore', initialCards)

  const onSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      await handleSubmit() // Assuming handleSubmit is an async function
      toast.success('Changes saved successfully!')
    } catch (error) {
      toast.error('Failed to save changes.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <form onSubmit={onSubmit} className='shadow-lg px-6 py-6 rounded-md'>
        <h2 className='font-bold text-19px my-2'>Explore section:</h2>
        {/* explor  */}
        <Grid container spacing={6}>
          <Grid item xs={12} sm={4} md={4} lg={3}>
            <PotraitCard index={0} formData={cards[0]} onFormChange={handleCardChange} />
          </Grid>
          <Grid item xs={12} sm={4} md={4} lg={3}>
            <PotraitCard index={1} formData={cards[1]} onFormChange={handleCardChange} />
          </Grid>
          <Grid item xs={12} sm={4} md={4} lg={3}>
            <PotraitCard index={2} formData={cards[2]} onFormChange={handleCardChange} />
          </Grid>
          <Grid item xs={12} sm={4} md={4} lg={3}>
            <PotraitCard index={3} formData={cards[3]} onFormChange={handleCardChange} />
          </Grid>
          <Grid item xs={12}>
            <Button
              type='submit'
              fullWidth
              variant='contained'
              className='w-[120px] float-end'
              disabled={loading} // Disable button when loading
            >
              {loading ? <CircularProgress size={24} color='inherit' /> : 'Save'}
            </Button>
          </Grid>
        </Grid>
      </form>
      <Toaster />
    </div>
  )
}

export default Explore
