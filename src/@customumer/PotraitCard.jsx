'use client'

import React, { useRef, useState } from 'react'
import { Card, CardContent, TextField, CircularProgress } from '@mui/material'

import { toast } from 'react-hot-toast'
import PropTypes from 'prop-types'

// Utility function to validate image size
// const isValidImageSize = (width, height) => {
//   const validDimensions = [{ width: 300, height: 430 }]

//   return validDimensions.some(dim => Math.abs(dim.width - width) < 10 && Math.abs(dim.height - height) < 10)
// }

const isValidImageSize = () => true

const PotraitCard = ({ index, formData = {}, onFormChange }) => {
  const fileInputRef = useRef(null)
  const [uploading, setUploading] = useState(false)

  const handleFormChange = (field, value) => {
    if (typeof onFormChange === 'function') {
      onFormChange(index, { ...formData, [field]: value })
    } else {
      console.error('onFormChange prop is not a function')
    }
  }

  const handleFileInputChange = async event => {
    const file = event.target.files[0]

    if (file) {
      const img = new Image()

      img.onload = async () => {
        const { width, height } = img

        if (isValidImageSize(width, height)) {
          setUploading(true)
          try {
            const formData = new FormData()
            formData.append('file', file)

            // Replace with your API endpoint that handles the file upload to S3
            const response = await fetch('/api/landscape', {
              method: 'POST',
              body: formData
            })

            const data = await response.json()
            if (response.ok) {
              handleFormChange('image', data.link) // Update the form with the S3 URL
              toast.success('Image uploaded successfully!')
            } else {
              toast.error('Failed to upload image: ' + data.message)
            }
          } catch (error) {
            console.error('Error uploading file:', error)
            toast.error('Error uploading file.')
          } finally {
            setUploading(false)
          }
        } else {
          toast.error('Invalid image size. Please upload an image with dimensions  300x430.')
        }
      }

      img.src = URL.createObjectURL(file)
    }
  }

  const handleFileInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <Card sx={{ padding: '7px', height: '100%' }} className='h-full'>
      <CardContent className='p-2'>
        <div className='relative w-full' style={{ height: '250px' }}>
          {uploading ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%'
              }}
            >
              <CircularProgress />
            </div>
          ) : (
            <img
              src={formData.image || '/images/avatars/placeholderimage.jpg'}
              alt='Profile'
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                cursor: 'pointer',
                backgroundColor: '#CCCCCC',
                borderRadius: '8px'
              }}
              onClick={handleFileInputClick} // Clicking on the image triggers file input
            />
          )}
          <input
            type='file'
            hidden
            ref={fileInputRef}
            accept='image/png, image/jpeg'
            onChange={handleFileInputChange}
          />
        </div>
      </CardContent>
      <CardContent className='p-2'>
        <TextField
          fullWidth
          label='Title'
          value={formData.title || ''}
          placeholder='Enter title of Image'
          onChange={e => handleFormChange('title', e.target.value)}
        />
      </CardContent>
    </Card>
  )
}

PotraitCard.propTypes = {
  index: PropTypes.number.isRequired,
  formData: PropTypes.object,
  onFormChange: PropTypes.func.isRequired
}

export default PotraitCard

// import React, { useRef, useState } from 'react'
// import { Card, CardContent, TextField, CircularProgress } from '@mui/material'
// import { toast } from 'react-hot-toast'
// import PropTypes from 'prop-types'

// // Utility function to validate image size
// const isValidImageSize = (width, height) => {
//   const validDimensions = [
//     { width: 630, height: 430 },
//     { width: 300, height: 430 }
//   ]

//   return validDimensions.some(dim => Math.abs(dim.width - width) < 10 && Math.abs(dim.height - height) < 10)
// }

// const LandscapceCard = ({ index, formData = {}, onFormChange }) => {
//   const fileInputRef = useRef(null)
//   const [uploading, setUploading] = useState(false)

//   const handleFormChange = (field, value) => {
//     if (typeof onFormChange === 'function') {
//       onFormChange(index, { ...formData, [field]: value })
//     } else {
//       console.error('onFormChange prop is not a function')
//     }
//   }

//   const handleFileInputChange = async event => {
//     const file = event.target.files[0]

//     if (file) {
//       const img = new Image()

//       img.onload = async () => {
//         const { width, height } = img

//         if (isValidImageSize(width, height)) {
//           setUploading(true)
//           try {
//             const formData = new FormData()
//             formData.append('file', file)

//             // Replace with your API endpoint that handles the file upload to S3
//             const response = await fetch('/api/landscape', {
//               method: 'POST',
//               body: formData
//             })

//             const data = await response.json()
//             if (response.ok) {
//               handleFormChange('image', data.link) // Update the form with the S3 URL
//               toast.success('Image uploaded successfully!')
//             } else {
//               toast.error('Failed to upload image: ' + data.message)
//             }
//           } catch (error) {
//             console.error('Error uploading file:', error)
//             toast.error('Error uploading file.')
//           } finally {
//             setUploading(false)
//           }
//         } else {
//           toast.error('Invalid image size. Please upload an image with dimensions 630x430 or 300x430.')
//         }
//       }

//       img.src = URL.createObjectURL(file)
//     }
//   }

//   const handleFileInputClick = () => {
//     if (fileInputRef.current) {
//       fileInputRef.current.click()
//     }
//   }

//   return (
//     <Card sx={{ padding: '7px', height: '100%' }} className='h-full'>
//       <CardContent className='p-2'>
//         <div className='relative w-full' style={{ height: '250px' }}>
//           {uploading ? (
//             <CircularProgress />
//           ) : (
//             <img
//               src={formData.image || '/images/avatars/placeholderimage.jpg'}
//               alt='Profile'
//               style={{
//                 width: '100%',
//                 height: '100%',
//                 objectFit: 'cover',
//                 cursor: 'pointer',
//                 backgroundColor: '#CCCCCC',
//                 borderRadius: '8px'
//               }}
//               onClick={handleFileInputClick} // Clicking on the image triggers file input
//             />
//           )}
//           <input
//             type='file'
//             hidden
//             ref={fileInputRef}
//             accept='image/png, image/jpeg'
//             onChange={handleFileInputChange}
//           />
//         </div>
//       </CardContent>
//       <CardContent className='p-2'>
//         <TextField
//           fullWidth
//           label='Title'
//           value={formData.title || ''}
//           placeholder='Enter title of Image'
//           onChange={e => handleFormChange('title', e.target.value)}
//         />
//       </CardContent>
//     </Card>
//   )
// }

// LandscapceCard.propTypes = {
//   index: PropTypes.number.isRequired,
//   formData: PropTypes.object,
//   onFormChange: PropTypes.func.isRequired
// }

// export default LandscapceCard
