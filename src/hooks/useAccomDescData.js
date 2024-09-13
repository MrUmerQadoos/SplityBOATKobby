'use client'
import { useState, useEffect } from 'react'

const useAccomDescData = initialCards => {
  const [cards, setCards] = useState(initialCards)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/findspecialplacetostay') // Update the endpoint to accom-desc
        if (response.ok) {
          const data = await response.json()
          if (data && data.findspecialplacetostay) {
            setCards(data.findspecialplacetostay) // Use findspecialplacetostay from the API
          }
        } else {
          console.error('Failed to fetch accommodation data:', response.statusText)
        }
      } catch (error) {
        console.error('Error fetching accommodation data:', error)
      }
    }

    fetchData()
  }, [])

  const handleCardChange = (index, updatedCard) => {
    const updatedCards = cards.map((card, i) => (i === index ? { ...card, ...updatedCard } : card))
    setCards(updatedCards)
  }

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/findspecialplacetostay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ findspecialplacetostay: cards }) // Send the updated cards
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Saved successfully:', result)
      } else {
        console.error('Failed to save accommodation data:', response.statusText)
      }
    } catch (error) {
      console.error('Error saving accommodation data:', error)
    }
  }

  return {
    cards,
    handleCardChange,
    handleSubmit
  }
}

export default useAccomDescData
