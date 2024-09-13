import React, { useState, useEffect } from 'react'
import { Grid, Card, CardMedia, CardContent, Typography } from '@mui/material'
import Link from 'next/link'
import InstagramLinkInput from './InstagramLinkInput'

const InstagramGallery = () => {
  const [galleryItems, setGalleryItems] = useState([])

  useEffect(() => {
    fetchGalleryItems()
  }, [])

  const fetchGalleryItems = async () => {
    try {
      const response = await fetch('/api/gallery')
      const data = await response.json()
      setGalleryItems(data)
    } catch (error) {
      console.error('Error fetching gallery items:', error)
    }
  }

  const handleNewPost = newItem => {
    setGalleryItems([newItem, ...galleryItems])
  }

  return (
    <div>
      <InstagramLinkInput onSubmit={handleNewPost} />
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {galleryItems.map(item => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card>
              <CardMedia component='img' height='200' image={item.imageUrl} alt={item.caption || 'Instagram post'} />
              <CardContent>
                <Typography variant='body2' color='text.secondary'>
                  Posted: {new Date(item.timestamp).toLocaleDateString()}
                </Typography>
                {item.caption && (
                  <Typography variant='body2' color='text.secondary'>
                    Caption: {item.caption.length > 100 ? `${item.caption.substring(0, 100)}...` : item.caption}
                  </Typography>
                )}
                {item.permalink && (
                  <Typography variant='body2' color='text.secondary'>
                    <Link href={item.permalink} passHref legacyBehavior>
                      <a target='_blank' rel='noopener noreferrer'>
                        View on Instagram
                      </a>
                    </Link>
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  )
}

export default InstagramGallery
