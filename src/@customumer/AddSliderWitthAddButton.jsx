'use client'

import { useState, useCallback, forwardRef, useImperativeHandle } from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import { IoAddCircleSharp } from 'react-icons/io5'
import { useDropzone } from 'react-dropzone'
import SlideCard from './SliderCard'
import { toast } from 'react-hot-toast'

const AddSliderWitthAddButton = forwardRef(({ onUpload }, ref) => {
  const [cards, setCards] = useState([])
  const [allImageUrls, setAllImageUrls] = useState([])

  // Expose methods to the parent component
  useImperativeHandle(ref, () => ({
    resetSlider() {
      setCards([])
      setAllImageUrls([])
      onUpload([]) // Notify parent component about the reset
    },
    validateImages() {
      if (allImageUrls.length === 0) {
        toast.error('Please upload at least one image before submitting.')

        return false
      }

      return true
    }
  }))

  // Function to validate image dimensions
  const isValidImageSize = (width, height) => width === 3840 && height === 2171

  const onDrop = useCallback(
    async acceptedFiles => {
      const newImageUrls = []

      for (const file of acceptedFiles) {
        // Validate image dimensions
        const img = new Image()

        img.src = URL.createObjectURL(file)

        img.onload = async () => {
          const { width, height } = img

          if (isValidImageSize(width, height)) {
            const mappedFile = Object.assign(file, { preview: img.src })

            setCards(prevCards => [...prevCards, mappedFile])

            const formData = new FormData()
            formData.append('file', file)

            try {
              const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
              })

              const data = await response.json()

              if (response.ok) {
                const { link } = data

                newImageUrls.push(link)

                setAllImageUrls(prevUrls => {
                  const updatedUrls = [...prevUrls, ...newImageUrls]
                  onUpload(updatedUrls)
                  return updatedUrls
                })
              } else {
                console.error('Failed to upload file:', data.message)
              }
            } catch (error) {
              console.error('Error uploading file:', error)
            }
          } else {
            toast.error('Invalid image size. Please upload an image with dimensions 3840 x 2171 pixels.')
          }
        }
      }
    },
    [onUpload]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*,video/*'
  })

  const handleDeleteCard = index => {
    const updatedCards = cards.filter((_, i) => i !== index)
    const updatedImageUrls = allImageUrls.filter((_, i) => i !== index)

    setCards(updatedCards)
    setAllImageUrls(updatedImageUrls)

    onUpload(updatedImageUrls) // Notify parent component
  }

  return (
    <div style={{ padding: '20px' }}>
      <Grid container spacing={3}>
        {cards.map((file, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <SlideCard
              file={file}
              onDelete={() => handleDeleteCard(index)}
              onPreview={() => console.log('Preview image or video')}
            />
          </Grid>
        ))}
        <Grid item xs={12} sm={6} md={4} className='min-h-[200px]'>
          <Card
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px dashed #ddd',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              position: 'relative',
              minHeight: '200px',
              minWidth: '150px'
            }}
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            {isDragActive ? <p>Drop the files here ...</p> : <p>Drag & Upload</p>}
            <IoAddCircleSharp style={{ fontSize: '36px', color: '#888' }} />
          </Card>
        </Grid>
      </Grid>
    </div>
  )
})

export default AddSliderWitthAddButton
