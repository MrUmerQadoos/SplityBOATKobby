'use client'
import React, { useState } from 'react'
import { TextField, Button, Box, Alert } from '@mui/material'

const InstagramLinkInput = ({ onSubmit }) => {
  const [link, setLink] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async e => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    try {
      // First, fetch Instagram data and get temp file path
      const instagramResponse = await fetch('/api/instagram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link })
      })
      if (!instagramResponse.ok) {
        throw new Error('Failed to fetch Instagram data')
      }
      const instagramData = await instagramResponse.json()

      // Then, upload to S3 and save to database
      const s3Response = await fetch('/api/upload-s3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tempFilePath: instagramData.tempFilePath,
          postUrl: link
        })
      })
      if (!s3Response.ok) {
        throw new Error('Failed to upload to S3')
      }
      const s3Data = await s3Response.json()

      onSubmit(s3Data.data)
      setLink('') // Clear the input after successful submission
    } catch (error) {
      console.error('Error processing Instagram post:', error)
      setError(error.message || 'An error occurred while processing the Instagram post')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box component='form' onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      {error && (
        <Alert severity='error' sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <TextField
        fullWidth
        value={link}
        onChange={e => setLink(e.target.value)}
        placeholder='Paste Instagram post link here'
        disabled={isLoading}
        sx={{ mb: 2 }}
      />
      <Button type='submit' variant='contained' color='primary' disabled={isLoading || !link.trim()} fullWidth>
        {isLoading ? 'Processing...' : 'Fetch Post'}
      </Button>
    </Box>
  )
}

export default InstagramLinkInput
