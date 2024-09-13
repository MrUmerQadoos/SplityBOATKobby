'use client'

import React from 'react'
import Card from '@mui/material/Card'
import { IconButton, CircularProgress } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import { Trash2, Eye } from 'lucide-react'
import ReactPlayer from 'react-player'

const BannnerCard = ({ file, onDelete, onPreview, isUploading }) => {
  const theme = useTheme()

  const isImage = file?.type?.startsWith('image')
  const isVideo = file?.type?.startsWith('video')

  return (
    <Card
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        position: 'relative',
        opacity: isUploading ? 0.5 : 1,
        width: '100%',
        height: '100%',
        overflow: 'hidden' // Ensure content doesn't overflow card
      }}
    >
      {/* Loader shown during upload */}
      {isUploading && <CircularProgress sx={{ position: 'absolute', zIndex: 10 }} />}

      {/* Render the image if it's an image file */}
      {!isUploading && isImage && (
        <img
          src={file.preview}
          alt='slide'
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '8px'
          }}
        />
      )}

      {/* Render the video player if it's a video file */}
      {!isUploading && isVideo && (
        <ReactPlayer url={file.preview} controls width='100%' height='100%' style={{ borderRadius: '8px' }} />
      )}

      {/* Delete button */}
      <IconButton
        onClick={onDelete}
        sx={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)',
          color: theme.palette.mode === 'dark' ? '#fff' : '#000', // Adjust icon color if needed
          zIndex: 1,
          pointerEvents: isUploading ? 'none' : 'auto',
          '&:hover': {
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.9)' // Hover effect
          }
        }}
        disabled={isUploading}
      >
        <Trash2 size={20} />
      </IconButton>

      {/* Preview button */}
      {/* <IconButton
        onClick={onPreview}
        sx={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          backgroundColor: 'rgba(255,255,255,0.7)',
          zIndex: 1,
          pointerEvents: isUploading ? 'none' : 'auto'
        }}
        disabled={isUploading}
      >
        <Eye size={20} />
      </IconButton> */}
    </Card>
  )
}

export default BannnerCard
