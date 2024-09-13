'use client'

import { useState, useCallback, useEffect, forwardRef, useImperativeHandle, useRef } from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CircularProgress from '@mui/material/CircularProgress'
import { IoAddCircleSharp } from 'react-icons/io5'
import { useDropzone } from 'react-dropzone'
import SlideCard from './SliderCard'
import { toast } from 'react-hot-toast'

// Utility function to validate image size
const isValidImageSize = (width, height) => {
  // return width === 3840 && height === 2171
  return true // Or implement a different validation logic
}

const SliderWithAddButton = forwardRef(({ imageUrls = [], onUpload }, ref) => {
  const [cards, setCards] = useState([])
  const [allImageUrls, setAllImageUrls] = useState(imageUrls)
  const [isUploading, setIsUploading] = useState(false)
  const imageUrlsRef = useRef(allImageUrls)
  const [uploadingStatuses, setUploadingStatuses] = useState([])

  useImperativeHandle(ref, () => ({
    resetSlider() {
      setCards([])
      setAllImageUrls([])
      imageUrlsRef.current = []
      onUpload([])
      setIsUploading(false) // Reset the uploading state when resetting
    },
    validateImages() {
      if (imageUrlsRef.current.length === 0) {
        toast.error('Please upload at least one image or video before submitting.')
        return false
      }
      return true
    }
  }))

  useEffect(() => {
    if (imageUrls.length > 0) {
      const existingCards = imageUrls.map(url => ({ preview: url, type: 'image/jpeg' }))
      setCards(existingCards)
      setAllImageUrls(imageUrls)
      imageUrlsRef.current = imageUrls
    }
  }, [imageUrls])

  const onDrop = useCallback(
    async acceptedFiles => {
      setIsUploading(true) // Set global uploading status

      const newImageUrls = []
      const newUploadingStatuses = [...uploadingStatuses]

      const filePromises = acceptedFiles.map(async (file, index) => {
        const url = URL.createObjectURL(file)
        newUploadingStatuses[index] = true // Set uploading status for the current file
        setUploadingStatuses([...newUploadingStatuses])

        // Validate image size if it's an image
        if (file.type.startsWith('image/')) {
          const img = new Image()
          img.onload = async () => {
            const { width, height } = img

            if (isValidImageSize(width, height)) {
              const formData = new FormData()
              formData.append('file', file)
              console.log(formData)
              try {
                const response = await fetch('/api/upload', {
                  method: 'POST',
                  body: formData
                })

                const data = await response.json()
                console.log('data',data);
                if (response.ok) {
                  const { link } = data
                  newImageUrls.push(link)

                  setAllImageUrls(prevUrls => {
                    const updatedUrls = [...prevUrls, link]
                    imageUrlsRef.current = updatedUrls
                    onUpload(updatedUrls) // Call the onUpload callback with the updated URLs
                    return updatedUrls
                  })

                  setCards(prevCards => [...prevCards, { preview: url, type: file.type }])
                } else {
                  console.error('Failed to upload file:', data.message)
                  toast.error(`Upload failed: ${data.message}`)
                }
              } catch (error) {
                console.error('Error uploading file:', error)
                toast.error('Error uploading file.')
              } finally {
                newUploadingStatuses[index] = false // Reset uploading status for the current file
                setUploadingStatuses([...newUploadingStatuses])
              }
            } else {
              toast.error('Invalid image size. Please upload an image with dimensions 3840x2171.')
              newUploadingStatuses[index] = false // Reset uploading status for the current file
              setUploadingStatuses([...newUploadingStatuses])
            }
          }
          img.src = url
        } else {
          // Handle video uploads
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
                const updatedUrls = [...prevUrls, link]
                imageUrlsRef.current = updatedUrls
                onUpload(updatedUrls) // Call the onUpload callback with the updated URLs
                return updatedUrls
              })

              setCards(prevCards => [...prevCards, { preview: url, type: 'video' }])
            } else {
              console.error('Failed to upload file:', data.message)
              toast.error(`Upload failed: ${data.message}`)
            }
          } catch (error) {
            console.error('Error uploading file:', error)
            toast.error('Error uploading file.')
          } finally {
            newUploadingStatuses[index] = false // Reset uploading status for the current file
            setUploadingStatuses([...newUploadingStatuses])
          }
        }
      })

      await Promise.all(filePromises)
      setIsUploading(false) // Stop the global loader after all files are processed
    },
    [onUpload, uploadingStatuses]
  )

  const handleDeleteCard = index => {
    const updatedCards = cards.filter((_, i) => i !== index)
    const updatedImageUrls = allImageUrls.filter((_, i) => i !== index)

    setCards(updatedCards)
    setAllImageUrls(updatedImageUrls)
    imageUrlsRef.current = updatedImageUrls
    onUpload(updatedImageUrls)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*'
  })

  return (
    <div style={{ padding: '20px' }}>
      <Grid container spacing={3}>
        {cards.map((file, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <SlideCard
              file={file}
              onDelete={() => handleDeleteCard(index)}
              onPreview={() => console.log('Preview image or video')}
              isUploading={uploadingStatuses[index]} // Pass the correct uploading status
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
              cursor: isUploading ? 'not-allowed' : 'pointer',
              position: 'relative',
              minHeight: '200px',
              minWidth: '150px'
            }}
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            {isUploading ? (
              <CircularProgress />
            ) : (
              <>
                {isDragActive ? <p>Drop the files here ...</p> : <p>Drag & Upload</p>}
                <IoAddCircleSharp style={{ fontSize: '36px', color: '#888' }} />
              </>
            )}
          </Card>
        </Grid>
      </Grid>
    </div>
  )
})

export default SliderWithAddButton
