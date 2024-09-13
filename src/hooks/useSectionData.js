'use client'
import { useState, useEffect } from 'react'

const useSectionData = (sectionName, initialCards) => {
  const [cards, setCards] = useState(initialCards)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/${sectionName}`)
        if (response.ok) {
          const data = await response.json()
          if (data && data[sectionName]) {
            setCards(data[sectionName])
          }
        } else {
          console.error(`Failed to fetch ${sectionName} data:`, response.statusText)
        }
      } catch (error) {
        console.error(`Error fetching ${sectionName} data:`, error)
      }
    }

    fetchData()
  }, [sectionName])

  const handleCardChange = (index, updatedCard) => {
    const updatedCards = cards.map((card, i) => (i === index ? { ...card, ...updatedCard } : card))
    setCards(updatedCards)
  }

  const handleSubmit = async () => {
    try {
      const response = await fetch(`/api/${sectionName}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [sectionName]: cards })
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Saved successfully:', result)
      } else {
        console.error(`Failed to save ${sectionName}:`, response.statusText)
      }
    } catch (error) {
      console.error(`Error saving ${sectionName}:`, error)
    }
  }

  return {
    cards,
    handleCardChange,
    handleSubmit
  }
}

export default useSectionData
