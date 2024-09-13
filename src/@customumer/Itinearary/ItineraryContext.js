'use client'

import React, { createContext, useContext, useState } from 'react'

const ItineraryContext = createContext()

export const ItineraryProvider = ({ children }) => {
  const [itineraries, setItineraries] = useState([])

  return <ItineraryContext.Provider value={{ itineraries, setItineraries }}>{children}</ItineraryContext.Provider>
}

export const useItinerary = () => useContext(ItineraryContext)
