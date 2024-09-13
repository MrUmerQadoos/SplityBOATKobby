'use client'

import { createAccommodation } from '@/action/accommodation' // Import the server action

import { useState, useEffect, useRef } from 'react'

import dynamic from 'next/dynamic'

import axios from 'axios'

import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

import 'react-quill/dist/quill.snow.css'

import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import { LoadScript, Autocomplete } from '@react-google-maps/api'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

import toast, { Toaster } from 'react-hot-toast'

import CircularProgress from '@mui/material/CircularProgress'

import PricingDetail from '@/@customumer/Form/PricingDetail'
import AgeRestriction from '@/@customumer/Form/AgeRestriction'
import TermsConditions from '@/@customumer/Form/TermsConditions'
import CancellationPolicy from '@/@customumer/Form/CancellationPolicy'
import OpeningTimes from '@/@customumer/Form/OpeningTimes'
import LocationCard from '@/@customumer/Form/LocationCard'

import Editor from '@/@customumer/Editor/Editor'
import dayjs from 'dayjs'

import { useItinerary } from '@/@customumer/Itinearary/ItineraryContext'

import SliderWithAddButton from '@/@customumer/SliderWithAddButton'
import { processEditorContent } from '../Editor/editImageHandler'

const RichTextEditor = dynamic(() => import('react-quill'), {
  ssr: false // Disable server-side rendering for this component
})

const cardStyles = {
  shadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
  marginBottom: '20px'
}

const initialData = {
  title: '',
  description: '',
  about: '',
  rating: '',
  prices: [],
  ageRestrictions: [],
  termsConditions: [],
  cancellationPolicies: [],
  openingTimes: [],
  location: [],
  accomodatiotype: '',
  imageUrls: [] // Field to store image URLs
}

const AddAccomudation = () => {
  const { itineraries, setItineraries } = useItinerary()
  const [formData, setFormData] = useState(initialData)

  const [newAgeRestrictionDescription, setNewAgeRestrictionDescription] = useState('')
  const [newTermsConditionsDescription, setNewTermsConditionsDescription] = useState('')
  const [newCancellationPolicyDescription, setNewCancellationPolicyDescription] = useState('')
  const [imageUrls, setImageUrls] = useState([]) // Separate state for image URLs

  const [priceNames, setPriceNames] = useState([])
  const [selectedPricingCategory, setSelectedPricingCategory] = useState('')
  const [selectedCurrency, setSelectedCurrency] = useState('HKD')
  const [amount, setAmount] = useState('')
  const [person, setPerson] = useState('')
  const [editorContent, setEditorContent] = useState('')

  const [isUploading, setIsUploading] = useState(false) // For handling the loader

  const [amPm, setAmPm] = useState('AM') // REMOVE this line

  const [locations, setLocations] = useState([{ address: '', lat: null, lng: null, suggestions: [], added: false }])

  const [autocompleteRefs, setAutocompleteRefs] = useState([])

  const [openingTime, setOpeningTime] = useState('')
  const [closingTime, setClosingTime] = useState('')
  const [openingAmPm, setOpeningAmPm] = useState('AM')
  const [closingAmPm, setClosingAmPm] = useState('AM')
  const [openingMonth, setOpeningMonth] = useState('')
  const [closingMonth, setClosingMonth] = useState('')

  // const [amPm, setAmPm] = useState('AM')

  const [isSubmitting, setIsSubmitting] = useState(false)

  const [categories, setCategories] = useState([])

  const currencies = ['HKD']
  const pricingCategories = ['Adult/Child', 'Single/Return', 'Weekday/Weekend']

  // Fetch categories from the database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/accomodationType') // Adjust endpoint as needed
        console.log(response)
        // const response = await createAccommodation(finalFormData)

        setCategories(response.data)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    fetchCategories()
  }, [])

  const handleAddPrice = () => {
    if (selectedPricingCategory && person && amount && selectedCurrency) {
      setFormData(prevFormData => ({
        ...prevFormData,
        prices: [
          ...prevFormData.prices,
          {
            category: selectedPricingCategory,
            name: person,
            value: `${amount} ${selectedCurrency}`
          }
        ]
      }))

      setPerson('')
      setAmount('')
      setSelectedCurrency('HKD')
      setSelectedPricingCategory('')
    } else {
      toast.error('Please fill out all fields before adding a price.')
    }
  }

  const imageUrlsRef = useRef([])

  const handleImageUpload = uploadedUrls => {
    console.log('Image URLs from SliderWithAddButton:', uploadedUrls)

    imageUrlsRef.current = uploadedUrls // Update the ref with the received URLs
    setFormData(prevData => ({
      ...prevData,
      imageUrls: uploadedUrls // Update the image URLs in the form data
    }))

    setIsUploading(false) // Stop the loader after processing the URLs
  }

  const handleEditorChange = html => {
    setEditorContent(html) // Update the editor content state
    setFormData(prevFormData => ({
      ...prevFormData,
      about: html // Update the form data with the editor's content
    }))
  }

  const handleLocationChange = async (index, event) => {
    const updatedLocations = [...locations]

    updatedLocations[index].address = event.target.value

    setLocations(updatedLocations)

    // Fetch suggestions based on input (mock or real API call)
    if (event.target.value) {
      try {
        const response = await axios.get('/api/getLocationSuggestions', {
          params: { input: event.target.value }
        })

        updatedLocations[index].suggestions = response.data // Assuming response.data contains suggestions
        setLocations(updatedLocations)
      } catch (error) {
        console.error('Error fetching location suggestions:', error)
      }
    }
  }

  const handleSuggestionClick = (index, suggestion) => {
    const updatedLocations = [...locations]

    updatedLocations[index].address = suggestion // Set address from suggestion

    updatedLocations[index].suggestions = [] // Clear suggestions after selection

    setLocations(updatedLocations)

    // Optionally, disable input if needed
    // document.querySelectorAll('input')[index].disabled = true;
  }

  const handleSaveLocation = index => {
    const locationToSave = locations[index]

    // Assuming formData contains the locations array
    setFormData(prevFormData => ({
      ...prevFormData,
      location: [...prevFormData.location, locationToSave]
    }))

    toast.success(`Location ${index + 1} saved successfully!`)
  }

  const handlePlaceChanged = index => {
    if (autocompleteRefs[index]) {
      const place = autocompleteRefs[index].getPlace()

      if (place.geometry && place.geometry.location) {
        const location = place.geometry.location

        const updatedLocations = [...locations]

        updatedLocations[index] = {
          ...updatedLocations[index],
          lat: location.lat(),
          lng: location.lng(),
          address: place.formatted_address || '',
          suggestions: [] // Clear suggestions once a place is selected
        }
        setLocations(updatedLocations)
      }
    }
  }

  const sliderRef = useRef()

  const removeLocation = index => {
    const updatedLocations = locations.filter((_, i) => i !== index)

    setLocations(updatedLocations)

    // Update formData location field if necessary
    setFormData(prevFormData => ({
      ...prevFormData,
      location: prevFormData.location.filter((_, i) => i !== index)
    }))
  }

  const addLocation = index => {
    const updatedLocations = [...locations]

    updatedLocations[index].added = true // Mark the current location as added

    setLocations(updatedLocations)

    // Add a new empty location field
    setLocations([...updatedLocations, { address: '', lat: null, lng: null, suggestions: [], added: false }])
  }

  const saveAllLocations = () => {
    const validLocations = locations.filter(location => location.lat !== null && location.lng !== null)

    setFormData(prevFormData => ({
      ...prevFormData,
      location: validLocations
    }))

    toast.success('All locations saved successfully!')
  }

  const handleAddAgeRestriction = () => {
    if (newAgeRestrictionDescription) {
      setFormData(prevFormData => ({
        ...prevFormData,
        ageRestrictions: [...prevFormData.ageRestrictions, { description: newAgeRestrictionDescription }]
      }))
      setNewAgeRestrictionDescription('')
    } else {
      toast.error('Please enter a description before adding an age restriction.')
    }
  }

  const handleAddTermsConditions = () => {
    if (newTermsConditionsDescription) {
      setFormData(prevFormData => ({
        ...prevFormData,
        termsConditions: [...prevFormData.termsConditions, { description: newTermsConditionsDescription }]
      }))
      setNewTermsConditionsDescription('')
    } else {
      toast.error('Please enter a description before adding terms and conditions.')
    }
  }

  const handleAddCancellationPolicy = () => {
    if (newCancellationPolicyDescription) {
      setFormData(prevFormData => ({
        ...prevFormData,
        cancellationPolicies: [...prevFormData.cancellationPolicies, { description: newCancellationPolicyDescription }]
      }))
      setNewCancellationPolicyDescription('')
    } else {
      toast.error('Please enter a description before adding a cancellation policy.')
    }
  }

  const handleAddOpeningTime = () => {
    if (openingTime && closingTime && openingMonth && closingMonth) {
      // Validation to check if the closing date is before the opening date
      if (closingMonth.isBefore(openingMonth)) {
        toast.error('Closing Month date cannot be before the Opening Month date.')
        return // Exit the function if validation fails
      }

      const newOpeningTime = {
        openingTime: `${openingTime} ${openingAmPm}`,
        closingTime: `${closingTime} ${closingAmPm}`,
        startMonth: dayjs(openingMonth).format('YYYY-MM-DD'), // Ensure formatting to string
        endMonth: dayjs(closingMonth).format('YYYY-MM-DD') // Ensure formatting to string
      }

      setFormData(prevFormData => ({
        ...prevFormData,
        openingTimes: [...prevFormData.openingTimes, newOpeningTime]
      }))

      // Reset states after adding
      setOpeningTime('')
      setClosingTime('')
      setOpeningMonth('')
      setClosingMonth('')
      setOpeningAmPm('AM') // Reset to default 'AM'
      setClosingAmPm('AM') // Reset to default 'AM'
    } else {
      toast.error('Please fill out all fields before adding opening times.')
    }
  }

  const handleRemove = (section, index) => {
    const updatedList = formData[section].filter((_, i) => i !== index)

    setFormData({ ...formData, [section]: updatedList })
  }

  const handleFormChange = (field, value) => {
    if (field === 'accomodatiotype' && typeof value === 'string') {
      setFormData(prevFormData => ({
        ...prevFormData,
        [field]: value
      }))
    } else {
      setFormData({ ...formData, [field]: value })
    }
  }

  const uploadTxtFile = async formData => {
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (response.ok) {
        const { link } = data

        return link
      } else {
        console.error('Failed to upload file:', data.message)
        toast.error(`Upload failed: ${data.message}`)
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      toast.error('Error uploading file.')
    }
  }

  // const processedEditorContent = await processEditorContent(editorContent)
  //   console.log(processEditorContent, 'processEditorContent')
  //   const finalFormData = {
  //     ...formData,
  //     about: processedEditorContent,
  //     imageUrls: imageUrlsRef.current,
  //     location: locations
  //       .filter(loc => loc.lat !== null && loc.lng !== null)
  //       .map(loc => ({
  //         lat: loc.lat,
  //         lng: loc.lng,
  //         address: loc.address // Include the address in the final form data
  //       }))
  //   }

  //   console.log('finalFormData', finalFormData)

  const handleSubmit = async e => {
    e.preventDefault()

    setIsSubmitting(true) // Start the loader

    if (!sliderRef.current.validateImages()) {
      setIsSubmitting(false)
      return
    }
    if (locations.length === 0 || locations.every(loc => !loc.address.trim())) {
      toast.error('Address not saved. Please add and save at least one location.')
      setIsSubmitting(false)
      return
    }

    const processedEditorContent = await processEditorContent(editorContent)
    console.log(processEditorContent, 'processEditorContent')

    const finalFormData = {
      ...formData,

      about: processedEditorContent,
      imageUrls: imageUrlsRef.current,
      // about: aboutFileUrl, // Ensure the correct image URLs are included
      location: locations
        .filter(loc => loc.lat !== null && loc.lng !== null)
        .map(loc => ({
          lat: loc.lat,
          lng: loc.lng,
          address: loc.address // Include the address in the final form data
        }))
    }

    console.log('finalFormData', finalFormData)

    try {
      // const response = await axios.post('/api/accomudation', finalFormData)
      const response = await createAccommodation(finalFormData)

      if (response.status === 200) {
        toast.success('Accommodation added successfully!')

        // Reset the entire form data, including about and location
        // setFormData(initialData)
        setFormData({
          ...initialData,
          about: '' // Reset the about field
        })
        setEditorContent('') // Reset the 'about' field in the editor
        setLocations([{ lat: null, lng: null }]) // Reset the locations array
        imageUrlsRef.current = [] // Clear the ref for image URLs
        setImageUrls([]) // Reset the image URLs state
        sliderRef.current.resetSlider() // Reset the slider component
        setLocations([{ address: '', lat: null, lng: null, suggestions: [], added: false }]) // Reset the locations array

        // Reset the opening and closing months
        setOpeningMonth('')
        setClosingMonth('')
        setOpeningAmPm('AM') // Reset to default 'AM'
        setClosingAmPm('AM') // Reset to default 'AM'

        window.location.reload()
      } else {
        toast.error('Failed to add accommodation.')
      }
    } catch (error) {
      toast.error('Failed to add accommodation.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardContent className='mbe-5'>
        <form onSubmit={handleSubmit}>
          <Card variant='outlined' sx={cardStyles} className=' shadow-lg'>
            <CardContent>
              <Grid container spacing={12}>
                <Grid item xs={12}>
                  <Grid container justifyContent='flex-start'>
                    <Typography variant='h4' align='left'>
                      Edit Hero Section
                    </Typography>
                  </Grid>
                  <Grid container justifyContent='flex-start'>
                    <Typography variant='h10' align='left'>
                      Upload Images and Videos
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid item xs={12}>
                    <SliderWithAddButton
                      ref={sliderRef}
                      onUpload={handleImageUpload} // This will call handleImageUpload when images are uploaded
                      imageUrls={formData.imageUrls} // Pass the current image URLs to the component
                      isUploading={isUploading} // Pass the uploading state
                      setIsUploading={setIsUploading} // Pass the function to start/stop loader
                    />
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Grid container spacing={5}>
            <Grid item xs={12} mt={4}>
              <Card variant='outlined' sx={cardStyles} className=' shadow-lg'>
                <CardContent>
                  <Typography variant='h6' className='mb-6'>
                    Accommodation Title
                  </Typography>
                  <TextField
                    required
                    fullWidth
                    label='Edit Title'
                    placeholder='Add Accommodation Name'
                    value={formData.title}
                    onChange={e => handleFormChange('title', e.target.value)}
                  />
                </CardContent>
              </Card>
            </Grid>

            {/* Categories */}

            <Grid item xs={12}>
              <Card variant='outlined' sx={cardStyles} className='my-9 shadow-lg'>
                <CardContent className='my-4'>
                  <Typography variant='h6' className='mb-6'>
                    Accommodation Type
                  </Typography>
                  <Select
                    fullWidth
                    value={formData.accomodatiotype}
                    onChange={e => handleFormChange('accomodatiotype', e.target.value)}
                    displayEmpty
                  >
                    <MenuItem value='' disabled>
                      Select Type
                    </MenuItem>
                    {categories.map((category, index) => (
                      <MenuItem key={index} value={category.name}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </CardContent>
              </Card>
            </Grid>
            {/* Accomodation description */}

            <Grid item xs={12} mt={4}>
              <Card variant='outlined' sx={cardStyles} className='shadow-lg min-h-[300px]'>
                <CardContent>
                  <Typography variant='h6' className='mb-6'>
                    Description
                  </Typography>
                  <TextField
                    required
                    fullWidth
                    multiline
                    rows={6}
                    label='Description'
                    placeholder='Add description'
                    value={formData.description}
                    onChange={e => handleFormChange('description', e.target.value)}
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} mt={4}>
              <Card variant='outlined' sx={cardStyles} className='shadow-lg min-h-[300px]'>
                <CardContent>
                  <Typography variant='h6' className='mb-6'>
                    About
                  </Typography>

                  {/* Replace this RichTextEditor with the new Editor */}
                  <Editor
                    value={editorContent}
                    onChange={handleEditorChange}
                    placeholder='Write about the accommodation...'
                  />
                </CardContent>
              </Card>
            </Grid>

            {/* Price Entry Card */}
            <Grid item xs={12}>
              <PricingDetail
                formData={formData}
                setFormData={setFormData}
                handleRemove={handleRemove}
                pricingCategories={pricingCategories}
                selectedPricingCategory={selectedPricingCategory}
                setSelectedPricingCategory={setSelectedPricingCategory}
                person={person}
                setPerson={setPerson}
                amount={amount}
                setAmount={setAmount}
                selectedCurrency={selectedCurrency}
                setSelectedCurrency={setSelectedCurrency}
                handleAddPrice={handleAddPrice}
                currencies={currencies}
              />
            </Grid>

            <Grid item xs={12}>
              <AgeRestriction
                formData={formData}
                setFormData={setFormData}
                handleRemove={handleRemove}
                newAgeRestrictionDescription={newAgeRestrictionDescription}
                setNewAgeRestrictionDescription={setNewAgeRestrictionDescription}
                handleAddAgeRestriction={handleAddAgeRestriction}
              />
            </Grid>

            <Grid item xs={12}>
              <TermsConditions
                formData={formData}
                setFormData={setFormData}
                handleRemove={handleRemove}
                newTermsConditionsDescription={newTermsConditionsDescription}
                setNewTermsConditionsDescription={setNewTermsConditionsDescription}
                handleAddTermsConditions={handleAddTermsConditions}
              />
            </Grid>

            <Grid item xs={12}>
              <CancellationPolicy
                formData={formData}
                setFormData={setFormData}
                handleRemove={handleRemove}
                newCancellationPolicyDescription={newCancellationPolicyDescription}
                setNewCancellationPolicyDescription={setNewCancellationPolicyDescription}
                handleAddCancellationPolicy={handleAddCancellationPolicy}
              />
            </Grid>

            <Grid item xs={12}>
              <OpeningTimes
                formData={formData}
                setFormData={setFormData}
                handleRemove={handleRemove}
                openingTime={openingTime}
                setOpeningTime={setOpeningTime}
                closingTime={closingTime}
                setClosingTime={setClosingTime}
                openingAmPm={openingAmPm} // Pass opening AM/PM state
                closingAmPm={closingAmPm} // Pass closing AM/PM state
                setOpeningAmPm={setOpeningAmPm} // Pass setter for opening AM/PM
                setClosingAmPm={setClosingAmPm}
                openingMonth={openingMonth}
                setOpeningMonth={setOpeningMonth}
                closingMonth={closingMonth}
                setClosingMonth={setClosingMonth}
                handleAddOpeningTime={handleAddOpeningTime}
              />
            </Grid>
            <Grid item xs={12}>
              <LocationCard
                locations={locations}
                setLocations={setLocations}
                autocompleteRefs={autocompleteRefs}
                setAutocompleteRefs={setAutocompleteRefs} // Pass setAutocompleteRefs as a prop
                addLocation={addLocation}
                removeLocation={removeLocation}
                handleLocationChange={handleLocationChange}
                handlePlaceChanged={handlePlaceChanged}
                handleSuggestionClick={handleSuggestionClick}
                saveAllLocations={saveAllLocations}
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12} mt={4} className=' flex justify-end mt-4 '>
              <Button variant='contained' type='submit' disabled={isSubmitting}>
                {isSubmitting ? <CircularProgress size={24} color='inherit' /> : ' Add Accommodation'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
      <Toaster />
    </Card>
  )
}

export default AddAccomudation
