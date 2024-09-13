'use client'

import { useState } from 'react'

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Input } from '@mui/material'

import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'

import { IoAddCircleSharp } from 'react-icons/io5'

import GalleryCard from './GalleryCard'

const GallerySlider = () => {
  const [cards, setCards] = useState([])
  const [openUploadDialog, setOpenUploadDialog] = useState(false)
  const [file, setFile] = useState(null)
  const [url, setUrl] = useState('')

  const handleAddCard = () => {
    setOpenUploadDialog(true)
  }

  const handleUploadFile = () => {
    if (file && url) {
      const reader = new FileReader()

      reader.onload = () => {
        setCards([...cards, { imageUrl: reader.result, url }])
        setFile(null)
        setUrl('')

        setOpenUploadDialog(false)
      }

      reader.readAsDataURL(file)
    } else {
      alert('Please fill all fields and upload an image')
    }
  }

  const handleDeleteCard = index => {
    setCards(cards.filter((_, i) => i !== index))
  }

  const handleFileChange = e => {
    setFile(e.target.files[0])
  }

  return (
    <div style={{ padding: '20px' }}>
      <Grid container spacing={3}>
        {cards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <GalleryCard imageUrl={card.imageUrl} url={card.url} onDelete={() => handleDeleteCard(index)} />
          </Grid>
        ))}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            className='w-full min-h-40 min-w-40 h-full'
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px dashed #ddd',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              position: 'relative',
              padding: '20px'
            }}
            onClick={handleAddCard}
          >
            <IoAddCircleSharp style={{ fontSize: '36px', color: '#888' }} />
            <p style={{ marginTop: '10px', fontSize: '16px', color: '#888' }}>Add a new card</p>
          </Card>
        </Grid>
      </Grid>
      <Dialog open={openUploadDialog} onClose={() => setOpenUploadDialog(false)}>
        <DialogTitle>Add New Card</DialogTitle>
        <DialogContent>
          <TextField
            label='Url'
            value={url}
            onChange={e => setUrl(e.target.value)}
            fullWidth
            style={{ marginBottom: '16px' }}
          />
          <Input type='file' inputProps={{ accept: 'image/*' }} onChange={handleFileChange} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUploadFile} color='primary'>
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default GallerySlider
