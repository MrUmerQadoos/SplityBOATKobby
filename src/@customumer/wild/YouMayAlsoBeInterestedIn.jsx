'use client'
import { useState } from 'react'

import { Button, Grid } from '@mui/material'

import { exploreSectionSchema } from '@/libs/zod'
import LandscapceCard from '@/@customumer/LandscapceCard'

const YouMayAlsoBeInterestedIn = () => {
  // State to hold data for each card
  const [cardsData, setCardsData] = useState([
    { title: 'Default title', imgSrc: '' },
    { title: 'Default title', imgSrc: '' },
    { title: 'Default title', imgSrc: '' },
    { title: 'Default title', imgSrc: '' }
  ])

  const handleFormChange = (index, newFormData) => {
    const newCardsData = [...cardsData]

    newCardsData[index] = newFormData
    setCardsData(newCardsData)
  }

  const handleSubmit = async event => {
    event.preventDefault()
    console.log(cardsData)

    // At this point, cardsData contains the data of each card.
    try {
      exploreSectionSchema.parse(cardsData)
      console.log('Data is valid')
    } catch (e) {
      console.error('Validation error:', e.errors)
    }

    // Example of sending the data to your backend
    // const req = await fetch('/api/exploresection', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(cardsData)
    // })

    // const response = await req.json()

    // console.log(response)
  }

  return (
    <form onSubmit={handleSubmit} className='shadow-lg px-6 py-6 rounded-md'>
      <h2 className='font-bold text-19px my-2'>You may also be interested in ...</h2>
      <Grid container spacing={6}>
        {cardsData.map((cardData, index) => (
          <Grid key={index} item xs={12} sm={6} md={6} lg={4} xl={3}>
            <LandscapceCard index={index} formData={cardData} onFormChange={handleFormChange} />
          </Grid>
        ))}
        <Grid item xs={12} md={12}>
          <Button type='submit' fullWidth variant='contained' className='w-[120px] float-end'>
            Save
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}

export default YouMayAlsoBeInterestedIn
