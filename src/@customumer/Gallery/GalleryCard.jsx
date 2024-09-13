'use client'

import { useState } from 'react'

import { IoEye } from 'react-icons/io5'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import { MdDeleteForever } from 'react-icons/md'
import CircularProgress from '@mui/material/CircularProgress'

const GalleryCard = ({ imageUrl, url, onDelete }) => {
  const [openDialog, setOpenDialog] = useState(false)
  const [previewSrc, setPreviewSrc] = useState('')
  const [hover, setHover] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const handlePreview = () => {
    setPreviewSrc(imageUrl)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setPreviewSrc('')
  }

  return (
    <>
      <Card
        sx={{
          position: 'relative',
          height: 'auto',
          width: '100%',
          maxWidth: '400px',
          border: '1px solid #ddd',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          borderRadius: '8px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          padding: '16px' // Add padding around the entire card
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '200px',
            overflow: 'hidden',
            padding: '8px' // Add padding around the image
          }}
        >
          {imageLoading && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 1
              }}
            >
              <CircularProgress />
            </div>
          )}
          <img
            src={imageUrl}
            alt='Profile'
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              transition: 'opacity 0.3s',
              opacity: imageLoaded ? 1 : 0.5
            }}
            onLoad={() => {
              setImageLoaded(true)
              setImageLoading(false)
            }}
            onError={() => setImageLoading(false)}
          />
          <div
            className='card-actions'
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              display: 'flex',
              flexDirection: 'column',
              opacity: hover ? 1 : 0,
              transition: 'opacity 0.3s'
            }}
          >
            <IconButton color='primary' onClick={handlePreview}>
              <IoEye />
            </IconButton>
            <IconButton color='primary' onClick={onDelete}>
              <MdDeleteForever />
            </IconButton>
          </div>
        </div>
        <CardContent style={{ padding: '8px', textAlign: 'center' }}>
          <div
            style={{
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: '#f9f9f9',
              wordBreak: 'break-word'
            }}
          >
            <h4 style={{ margin: '0', fontSize: '16px', color: '#333' }}>{url}</h4>
          </div>
        </CardContent>
      </Card>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Preview</DialogTitle>
        <DialogContent>
          <img src={previewSrc} alt='Preview' style={{ width: '100%', height: 'auto', objectFit: 'contain' }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color='primary'>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default GalleryCard
