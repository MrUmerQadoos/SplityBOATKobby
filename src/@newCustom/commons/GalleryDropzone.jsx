'use client'
import React, { useCallback, useState } from 'react'

import { Trash2 } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { Button, TextField, Dialog, DialogContent, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

function MyDropzone() {
  const [files, setFiles] = useState([])
  const [open, setOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)

  const onDrop = useCallback(acceptedFiles => {
    const mappedFiles = acceptedFiles.map(file =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        url: ''
      })
    )

    setFiles(prevFiles => [...prevFiles, ...mappedFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const removeFile = file => () => {
    setFiles(prevFiles => prevFiles.filter(f => f.name !== file.name))
    URL.revokeObjectURL(file.preview)
  }

  const handleURLChange = (file, index) => event => {
    const newFiles = [...files]

    newFiles[index] = { ...file, url: event.target.value }
    setFiles(newFiles)
  }

  const handleImageClick = file => () => {
    setSelectedImage(file)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setSelectedImage(null)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const formData = new FormData()

    files.forEach(file => {
      formData.append('files', file)
      formData.append('urls', file.url)
    })

    try {
      // const response = await fetch('/upload-endpoint', {
      //   method: 'POST',
      //   body: formData,
      // })

      if (response.ok) {
        console.log('Files and URLs uploaded successfully')
      } else {
        console.error('Failed to upload files and URLs')
      }
    } catch (error) {
      console.error('Error uploading files and URLs', error)
    }
  }

  const thumbs = files.map((file, index) => (
    <div style={thumbStyle} key={file.name}>
      <div style={thumbInnerStyle}>
        <img src={file.preview} style={imgStyle} alt={file.name} onClick={handleImageClick(file)} />
      </div>
      <TextField
        label='Instagram URL'
        variant='outlined'
        fullWidth
        value={file.url}
        onChange={handleURLChange(file, index)}
        style={{ marginTop: '8px' }}
      />
      <button style={removeButtonStyle} onClick={removeFile(file)}>
        <Trash2 size={16} />
      </button>
    </div>
  ))

  return (
    <>
      <form onSubmit={handleSubmit} className='shadow-lg px-6 py-5 rounded-md'>
        <h2 className='font-bold text-19px mb-2'>Gallery section:</h2>
        <div {...getRootProps()} style={dropzoneStyle}>
          <input {...getInputProps()} />
          {isDragActive ? <p>Drop the files here ...</p> : <p>Drag & drop some files here, or click to select files</p>}
        </div>
        <aside style={thumbsContainerStyle}>{thumbs}</aside>
        <div className='flex justify-end'>
          <Button type='submit' fullWidth variant='contained' className='w-[120px] float-end'>
            Save
          </Button>
        </div>
      </form>

      <Dialog open={open} onClose={handleClose} maxWidth='md' fullWidth>
        <IconButton
          aria-label='close'
          onClick={handleClose}
          style={{ position: 'absolute', right: 8, top: 8, color: 'black' }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent style={{ padding: '16px' }}>
          {selectedImage && (
            <img
              src={selectedImage.preview}
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '80vh',
                objectFit: 'contain'
              }}
              alt={selectedImage.name}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

const dropzoneStyle = {
  width: '100%',
  height: '200px',
  borderWidth: '2px',
  borderStyle: 'dashed',
  borderRadius: '5px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '20px',
  cursor: 'pointer'
}

const thumbsContainerStyle = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: '16px'
}

const thumbStyle = {
  display: 'inline-flex',
  flexDirection: 'column',
  borderRadius: '2px',
  border: '1px solid #eaeaea',
  marginBottom: '8px',
  marginRight: '8px',
  borderRadius: '6px',
  width: '220px',
  height: '300px',
  padding: '4px',
  boxSizing: 'border-box',
  position: 'relative'
}

const thumbInnerStyle = {
  display: 'flex',
  minWidth: 0,
  flex: '1',
  overflow: 'hidden',
  borderRadius: '6px'
}

const imgStyle = {
  display: 'block',
  width: 'auto',
  height: '100%',
  objectFit: 'cover',
  cursor: 'pointer'
}

const removeButtonStyle = {
  position: 'absolute',
  top: '5px',
  right: '5px',
  background: 'red',
  color: 'white',
  border: 'none',
  borderRadius: '50%',
  width: '20px',
  height: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  fontSize: '12px'
}

export default MyDropzone
