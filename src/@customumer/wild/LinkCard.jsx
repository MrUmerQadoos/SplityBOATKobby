'use client'

import { useState } from 'react'

import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'

const LinkCard = () => {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [instagram, setInstagram] = useState('')
  const [facebook, setFacebook] = useState('')
  const [youtube, setYoutube] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = e => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div style={{ padding: '20px' }}>
      {!submitted ? (
        <Card
          sx={{
            maxWidth: '500px',
            margin: 'auto',
            padding: '20px',
            border: '1px solid #ddd',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            borderRadius: '8px'
          }}
        >
          <CardContent>
            <form onSubmit={handleSubmit}>
              <TextField
                label='Email'
                variant='outlined'
                fullWidth
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ marginBottom: '16px' }}
                required
              />
              <TextField
                label='Phone'
                variant='outlined'
                fullWidth
                value={phone}
                onChange={e => setPhone(e.target.value)}
                style={{ marginBottom: '16px' }}
                required
              />
              <TextField
                label='Instagram'
                variant='outlined'
                fullWidth
                value={instagram}
                onChange={e => setInstagram(e.target.value)}
                style={{ marginBottom: '16px' }}
                required
              />
              <TextField
                label='Facebook'
                variant='outlined'
                fullWidth
                value={facebook}
                onChange={e => setFacebook(e.target.value)}
                style={{ marginBottom: '16px' }}
                required
              />
              <TextField
                label='YouTube'
                variant='outlined'
                fullWidth
                value={youtube}
                onChange={e => setYoutube(e.target.value)}
                style={{ marginBottom: '16px' }}
                required
              />
              {/* <Button type='submit' variant='contained' color='primary'>
                Submit
              </Button> */}
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card
          sx={{
            maxWidth: '500px',
            margin: 'auto',
            padding: '20px',
            border: '1px solid #ddd',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            borderRadius: '8px'
          }}
        >
          <CardContent>
            <h3>Contact Information</h3>
            <p>
              <strong>Email:</strong> {email}
            </p>
            <p>
              <strong>Phone:</strong> {phone}
            </p>
            <p>
              <strong>Instagram:</strong> {instagram}
            </p>
            <p>
              <strong>Facebook:</strong> {facebook}
            </p>
            <p>
              <strong>YouTube:</strong> {youtube}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default LinkCard
