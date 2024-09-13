'use client'

import { useState, useEffect, useRef } from 'react'

import dayjs from 'dayjs'

import dynamic from 'next/dynamic'

import axios from 'axios'

import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

import InputAdornment from '@mui/material/InputAdornment'

import SkeletonLoader from '@/@customumer/AccomudationComponent/SkeletonLoader'

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
import { useRouter, useParams } from 'next/navigation'

import CircularProgress from '@mui/material/CircularProgress'

import PricingDetail from '@/@customumer/Form/PricingDetail'
import AgeRestriction from '@/@customumer/Form/AgeRestriction'
import TermsConditions from '@/@customumer/Form/TermsConditions'
import CancellationPolicy from '@/@customumer/Form/CancellationPolicy'
import OpeningTimes from '@/@customumer/Form/OpeningTimes'
import LocationCard from '@/@customumer/Form/LocationCard'

import Editor from '@/@customumer/Editor/Editor'

// import { useRouter } from 'next/navigation'

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
  categories: '',
  imageUrls: [] // Field to store image URLs
}

const EditItinearary = () => {
  const libraries = ['places']

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

  const [locations, setLocations] = useState([{ address: '', lat: null, lng: null, suggestions: [], added: false }])
  const [isLoading, setIsLoading] = useState(true)
  const [autocompleteRefs, setAutocompleteRefs] = useState([])

  const [openingTime, setOpeningTime] = useState('')
  const [closingTime, setClosingTime] = useState('')
  const [openingAmPm, setOpeningAmPm] = useState('AM')
  const [closingAmPm, setClosingAmPm] = useState('AM')
  const [openingMonth, setOpeningMonth] = useState('')
  const [closingMonth, setClosingMonth] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)

  const [categories, setCategories] = useState([])

  const currencies = ['HKD']
  // const currencies = ['HKD', 'USD', 'EUR', 'PKR', 'INR']

  const pricingCategories = ['Adult/Child', 'Single/Return', 'Weekday/Weekend']

  const router = useRouter()
  const { id } = useParams() // Use useParams to get the id from the route

  // useEffect(() => {
  //   if (id) {
  //     const fetchItinerary = async () => {
  //       setIsLoading(true)
  //       try {
  //         const response = await axios.get(`/api/itinerary?id=${id}`)
  //         const itinerary = response.data.itinerary

  //         // Safely map the images if any
  //         const urls = itinerary.images ? itinerary.images.map(image => image.url) : []
  //         setImageUrls(urls)

  //         // Map locations from the database
  //         const mappedLocations = itinerary.locations
  //           ? itinerary.locations.map(loc => {
  //               const mappedLoc = {
  //                 address: loc.address || '', // Use the address directly from the database
  //                 lat: loc.lat || null,
  //                 lng: loc.lng || null,
  //                 suggestions: [], // Initialize suggestions as an empty array
  //                 added: true // Mark these as already added
  //               }
  //               console.log('Mapped Location:', mappedLoc) // Log each mapped location
  //               return mappedLoc
  //             })
  //           : []

  //         console.log('All Mapped Locations:', mappedLocations) // Log all mapped locations

  //         // Append an empty location for adding new entries
  //         setLocations([...mappedLocations, { address: '', lat: null, lng: null, suggestions: [], added: false }])

  //         // Set the form data with fetched values
  //         setFormData({
  //           ...initialData, // Start with initial data structure to avoid missing fields
  //           ...itinerary, // Override with fetched data
  //           locations: mappedLocations // Override locations with the mapped data
  //         })

  //         setEditorContent(itinerary.about || '')
  //       } catch (error) {
  //         console.error('Error fetching itinerary data:', error)
  //         toast.error('Failed to load itinerary data.')
  //       } finally {
  //         setIsLoading(false)
  //       }
  //     }

  //     fetchItinerary()
  //   }
  // }, [id])

  useEffect(() => {
    if (id) {
      const fetchItinerary = async () => {
        setIsLoading(true)
        try {
          const response = await axios.get(`/api/itinerary?id=${id}`)
          const itinerary = response.data.itinerary

          // Safely map the images if any
          const urls = itinerary.images ? itinerary.images.map(image => image.url) : []
          setImageUrls(urls)

          // Map locations from the database
          const mappedLocations = itinerary.locations
            ? itinerary.locations.map(loc => ({
                address: loc.address || '',
                lat: loc.lat || null,
                lng: loc.lng || null,
                suggestions: [],
                added: true
              }))
            : []

          // Append an empty location for adding new entries
          // setLocations([...mappedLocations, { address: '', lat: null, lng: null, suggestions: [], added: false }])
          setLocations([...mappedLocations])
          setFormData({ ...initialData, ...itinerary, locations: mappedLocations })
          setEditorContent(itinerary.about || '')
        } catch (error) {
          toast.error('Failed to load itinerary data.')
        } finally {
          setIsLoading(false)
        }
      }

      fetchItinerary()
    }
  }, [id])

  // Fetch categories from the database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/categories') // Adjust endpoint as needed

        setCategories(response.data)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    fetchCategories()
  }, [])

  // LOCATION

  const addLocation = () => {
    setLocations([...locations, { address: '', lat: null, lng: null, suggestions: [], added: false }])
  }

  const removeLocation = index => {
    setLocations(locations.filter((_, i) => i !== index))
  }

  const addNewLocation = index => {
    const place = autocompleteRefs[index]?.getPlace()
    const { formatted_address, geometry } = place || {}
    if (geometry) {
      const newLocations = [...locations]
      newLocations[index] = {
        ...newLocations[index],
        address: formatted_address,
        lat: geometry.location.lat(),
        lng: geometry.location.lng(),
        added: true
      }
      setLocations(newLocations)
    }
  }

  const handlePlaceChanged = index => {
    console.log('first', index)
    const place = autocompleteRefs[index]?.getPlace()
    console.log('getPlace', place)

    const { formatted_address, geometry } = place || {}
    if (geometry) {
      const newLocations = [...locations]
      newLocations[index] = {
        ...newLocations[index],
        address: formatted_address,
        lat: geometry.location.lat(),
        lng: geometry.location.lng(),
        added: true
      }
      setLocations(newLocations)
    }
  }

  const handleLocationChange = (index, value) => {
    const newLocations = [...locations]
    newLocations[index].address = value
    setLocations(newLocations)
  }

  const handleSuggestionClick = (index, suggestion) => {
    const newLocations = [...locations]
    newLocations[index].address = suggestion
    setLocations(newLocations)
  }

  const saveAllLocations = async () => {
    const validLocations = locations.filter(loc => loc.lat && loc.lng)
    // Handle form submission including the valid locations
  }

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

  const handleImageUpload = urls => {
    console.log('Image URLs from SliderWithAddButton:', urls)
    imageUrlsRef.current = urls
    setFormData(prevData => ({
      ...prevData,
      imageUrls: urls
    }))
  }

  // const handleEditorChange = value => {
  //   setEditorContent(value)
  //   setFormData(prevFormData => ({
  //     ...prevFormData,
  //     about: value // Update formData's 'about' field with the new editor content
  //   }))
  // }

  const handleEditorChange = html => {
    setEditorContent(html) // Update the editor content state
    setFormData(prevFormData => ({
      ...prevFormData,
      about: html // Update the form data with the editor's content
    }))
  }

  const sliderRef = useRef()

  const handleAddAgeRestriction = () => {
    if (newAgeRestrictionDescription) {
      setFormData({
        ...formData,
        ageRestrictions: [...formData.ageRestrictions, { description: newAgeRestrictionDescription }]
      })
      setNewAgeRestrictionDescription('')
    }
  }

  const handleAddTermsConditions = () => {
    if (newTermsConditionsDescription) {
      setFormData({
        ...formData,
        termsConditions: [...formData.termsConditions, { description: newTermsConditionsDescription }]
      })
      setNewTermsConditionsDescription('')
    }
  }

  const handleAddCancellationPolicy = () => {
    if (newCancellationPolicyDescription) {
      setFormData({
        ...formData,
        cancellationPolicies: [...formData.cancellationPolicies, { description: newCancellationPolicyDescription }]
      })
      setNewCancellationPolicyDescription('')
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
    if (field === 'categories' && typeof value === 'string') {
      setFormData(prevFormData => ({
        ...prevFormData,
        [field]: value
      }))
    } else {
      setFormData({ ...formData, [field]: value })
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!sliderRef.current.validateImages()) {
      setIsSubmitting(false)
      return
    }

    // Clean up location data to include lat, lng, and address
    const validLocations = locations
      .filter(loc => loc.lat !== null && loc.lng !== null)
      .map(loc => ({
        lat: loc.lat,
        lng: loc.lng,
        address: loc.address // Include address in the final form data
      }))

    const processedEditorContent = await processEditorContent(editorContent)
    console.log(processEditorContent, 'processEditorContent')

    const updateData = {
      title: formData.title,
      description: formData.description,
      // about: formData.about,
      about: processedEditorContent,

      // about: processedEditorContent || formData.about, // Use the processed content or existing about data
      rating: formData.rating,
      categories: formData.categories,
      locations: validLocations, // Assign cleaned-up locations array
      prices: formData.prices.map(price => ({
        category: price.category,
        name: price.name,
        value: price.value
      })),
      ageRestrictions: formData.ageRestrictions.map(restriction => ({
        description: restriction.description
      })),
      termsConditions: formData.termsConditions.map(condition => ({
        description: condition.description
      })),
      cancellationPolicies: formData.cancellationPolicies.map(policy => ({
        description: policy.description
      })),
      openingTimes: formData.openingTimes.map(time => ({
        openingTime: time.openingTime,
        closingTime: time.closingTime,
        month: time.month
      })),
      imageUrls: imageUrlsRef.current.map(url => ({ url })) // Use current image URLs
    }

    console.log('updateData', updateData)

    try {
      const response = id
        ? await axios.put(`/api/itinerary/${id}`, updateData) // Update API call
        : await axios.post('/api/itinerary/', updateData) // Create new accommodation

      if (response.status === 200) {
        toast.success(`itinerary ${id ? 'updated' : 'added'} successfully!`)
        if (!id) {
          resetForm() // Reset form fields after successful submission
        }
      } else {
        toast.error(`Failed to ${id ? 'update' : 'add'} itinerary.`)
      }
    } catch (error) {
      toast.error(`Failed to ${id ? 'update' : 'add'} itinerary.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <SkeletonLoader />
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
                      onUpload={handleImageUpload}
                      imageUrls={imageUrls} // Add this line to pass the image URLs to the component
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
                    Itinerary Title
                  </Typography>
                  <TextField
                    required
                    fullWidth
                    label='Edit Title'
                    placeholder='Add itinerary Name'
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
                    Itinerary Type
                  </Typography>
                  <Select
                    fullWidth
                    value={formData.categories}
                    onChange={e => handleFormChange('categories', e.target.value)}
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

            {/* About
            <Grid item xs={12} mt={4}>
              <Card variant='outlined' sx={cardStyles} className='shadow-lg min-h-[300px]'>
                <CardContent>
                  <Typography variant='h6' className='mb-6'>
                    About
                  </Typography>

                  <RichTextEditor
                    value={editorContent}
                    onChange={handleEditorChange}
                    modules={{
                      toolbar: [
                        [{ header: '1' }, { header: '2' }, { font: [] }], // Row 1
                        [{ list: 'ordered' }, { list: 'bullet' }], // Row 2
                        ['bold', 'italic', 'underline'], // Row 3
                        ['link'], // Row 4
                        [{ align: [] }], // Row 5
                        ['clean'] // Row 6
                      ]
                    }}
                    className='h-[150px]' // Use the important class
                    style={{ minHeight: '150px' }} // Inline style as a fallback
                  />
                </CardContent>
              </Card>
            </Grid> */}

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
              <Card>
                <CardContent>
                  <Typography variant='h6' className='mb-4'>
                    Locations
                  </Typography>
                  <LoadScript
                    googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY} // Replace with your actual API key
                    libraries={libraries}
                  >
                    {locations.map((location, index) => (
                      <Grid container spacing={2} key={index} className='mb-4 align-items-center'>
                        <Grid item xs={7} sx={{ position: 'relative' }}>
                          <Autocomplete
                            onLoad={autocomplete => {
                              const updatedRefs = [...autocompleteRefs]
                              updatedRefs[index] = autocomplete
                              setAutocompleteRefs(updatedRefs)
                            }}
                            onPlaceChanged={() => handlePlaceChanged(index)}
                          >
                            <TextField
                              fullWidth
                              label={`Location ${index + 1}`}
                              variant='outlined'
                              value={location.address}
                              onChange={e => handleLocationChange(index, e.target.value)}
                              disabled={location.added}
                            />
                          </Autocomplete>
                        </Grid>
                        <Grid item xs={3} className='flex items-center justify-center'>
                          {!location.added && (
                            <Button
                              variant='contained'
                              color='primary'
                              onClick={() => addNewLocation(index)}
                              disabled={location.lat === null || location.lng === null}
                              sx={{
                                width: '70%',
                                display: location.lat === null || location.lng === null ? 'none' : 'block', // Hide or show button based on condition
                                transition: 'opacity 0.3s' // Optional: Add transition for smooth opacity change
                              }}
                            >
                              Add
                            </Button>
                          )}
                        </Grid>
                        <Grid item xs={2} className='flex items-center justify-center'>
                          <IconButton onClick={() => removeLocation(index)} color='error'>
                            <DeleteIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    ))}
                    <Grid item xs={12} className='flex justify-end mt-4'>
                      <Button variant='contained' color='primary' onClick={addLocation}>
                        Add New Location
                      </Button>
                    </Grid>
                  </LoadScript>
                </CardContent>
                <Toaster />
              </Card>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12} mt={4} className=' flex justify-end mt-4 '>
              <Button variant='contained' type='submit' disabled={isSubmitting}>
                {isSubmitting ? <CircularProgress size={24} color='inherit' /> : ' Update Itinerary'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
      <Toaster />
    </Card>
  )
}

export default EditItinearary

// 'use client'

// import { useState, useEffect, useRef } from 'react'

// import dynamic from 'next/dynamic'

// import axios from 'axios'

// import Grid from '@mui/material/Grid'
// import Card from '@mui/material/Card'
// import CardContent from '@mui/material/CardContent'
// import InputAdornment from '@mui/material/InputAdornment'

// import SkeletonLoader from '@/@customumer/AccomudationComponent/SkeletonLoader'

// import 'react-quill/dist/quill.snow.css'

// import Button from '@mui/material/Button'
// import Typography from '@mui/material/Typography'
// import TextField from '@mui/material/TextField'
// import List from '@mui/material/List'
// import ListItem from '@mui/material/ListItem'
// import ListItemText from '@mui/material/ListItemText'
// import { LoadScript, Autocomplete } from '@react-google-maps/api'
// import IconButton from '@mui/material/IconButton'
// import DeleteIcon from '@mui/icons-material/Delete'
// import Select from '@mui/material/Select'
// import MenuItem from '@mui/material/MenuItem'

// import toast, { Toaster } from 'react-hot-toast'
// import { useRouter, useParams } from 'next/navigation'

// import CircularProgress from '@mui/material/CircularProgress'

// import PricingDetail from '@/@customumer/Form/PricingDetail'
// import AgeRestriction from '@/@customumer/Form/AgeRestriction'
// import TermsConditions from '@/@customumer/Form/TermsConditions'
// import CancellationPolicy from '@/@customumer/Form/CancellationPolicy'
// import OpeningTimes from '@/@customumer/Form/OpeningTimes'
// import LocationCard from '@/@customumer/Form/LocationCard'

// // import { useRouter } from 'next/navigation'

// import SliderWithAddButton from '@/@customumer/SliderWithAddButton'

// const RichTextEditor = dynamic(() => import('react-quill'), {
//   ssr: false // Disable server-side rendering for this component
// })

// const cardStyles = {
//   shadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
//   marginBottom: '20px'
// }

// const initialData = {
//   title: '',
//   description: '',
//   about: '',
//   rating: '',
//   prices: [],
//   ageRestrictions: [],
//   termsConditions: [],
//   cancellationPolicies: [],
//   openingTimes: [],
//   location: [],
//   categories: '',
//   imageUrls: [] // Field to store image URLs
// }

// const EditItinearary = () => {
//   const [formData, setFormData] = useState(initialData)

//   const [newAgeRestrictionDescription, setNewAgeRestrictionDescription] = useState('')
//   const [newTermsConditionsDescription, setNewTermsConditionsDescription] = useState('')
//   const [newCancellationPolicyDescription, setNewCancellationPolicyDescription] = useState('')
//   const [imageUrls, setImageUrls] = useState([]) // Separate state for image URLs

//   const [priceNames, setPriceNames] = useState([])
//   const [selectedPricingCategory, setSelectedPricingCategory] = useState('')
//   const [selectedCurrency, setSelectedCurrency] = useState('HKD')
//   const [amount, setAmount] = useState('')
//   const [person, setPerson] = useState('')
//   const [editorContent, setEditorContent] = useState('')

//   const [locations, setLocations] = useState([{ address: '', lat: null, lng: null, suggestions: [], added: false }])

//   const [isLoading, setIsLoading] = useState(true)

//   const [autocompleteRefs, setAutocompleteRefs] = useState([])

//   const [openingTime, setOpeningTime] = useState('')
//   const [closingTime, setClosingTime] = useState('')
//   const [openingMonth, setOpeningMonth] = useState('')
//   const [amPm, setAmPm] = useState('AM')

//   const [isSubmitting, setIsSubmitting] = useState(false)

//   const [categories, setCategories] = useState([])

//   const currencies = ['HKD', 'USD', 'EUR', 'PKR', 'INR']
//   const pricingCategories = ['Adult/Child', 'Single/Return', 'Weekday/Weekend']

//   const router = useRouter()
//   const { id } = useParams() // Use useParams to get the id from the route

//   useEffect(() => {
//     if (id) {
//       const fetchItinerary = async () => {
//         setIsLoading(true)
//         try {
//           const response = await axios.get(`/api/itinerary?id=${id}`)
//           const itinerary = response.data.itinerary

//           // Safely map the images if any
//           const urls = itinerary.images ? itinerary.images.map(image => image.url) : []
//           setImageUrls(urls)

//           // Map locations from the database
//           const mappedLocations = itinerary.locations
//             ? itinerary.locations.map(loc => {
//                 const mappedLoc = {
//                   address: loc.address || '', // Use the address directly from the database
//                   lat: loc.lat || null,
//                   lng: loc.lng || null,
//                   suggestions: [], // Initialize suggestions as an empty array
//                   added: true // Mark these as already added
//                 }
//                 console.log('Mapped Location:', mappedLoc) // Log each mapped location
//                 return mappedLoc
//               })
//             : []

//           console.log('All Mapped Locations:', mappedLocations) // Log all mapped locations

//           // Append an empty location for adding new entries
//           setLocations([...mappedLocations, { address: '', lat: null, lng: null, suggestions: [], added: false }])

//           // Set the form data with fetched values
//           setFormData({
//             ...initialData, // Start with initial data structure to avoid missing fields
//             ...itinerary, // Override with fetched data
//             locations: mappedLocations // Override locations with the mapped data
//           })

//           setEditorContent(itinerary.about || '')
//         } catch (error) {
//           console.error('Error fetching itinerary data:', error)
//           toast.error('Failed to load itinerary data.')
//         } finally {
//           setIsLoading(false)
//         }
//       }

//       fetchItinerary()
//     }
//   }, [id])

//   const handleLocationChange = async (index, event) => {
//     const updatedLocations = [...locations]

//     updatedLocations[index].address = event.target.value

//     setLocations(updatedLocations)

//     // Fetch suggestions based on input (mock or real API call)
//     if (event.target.value) {
//       try {
//         const response = await axios.get('/api/getLocationSuggestions', {
//           params: { input: event.target.value }
//         })

//         updatedLocations[index].suggestions = response.data // Assuming response.data contains suggestions
//         setLocations(updatedLocations)
//       } catch (error) {
//         console.error('Error fetching location suggestions:', error)
//       }
//     }
//   }

//   const removeLocation = index => {
//     const updatedLocations = locations.filter((_, i) => i !== index)
//     setLocations(updatedLocations)

//     // Update formData location field if necessary
//     setFormData(prevFormData => ({
//       ...prevFormData,
//       location: updatedLocations
//     }))
//   }
//   const saveAllLocations = () => {
//     const validLocations = locations.filter(location => location.lat !== null && location.lng !== null)

//     setFormData(prevFormData => ({
//       ...prevFormData,
//       location: validLocations
//     }))

//     toast.success('All locations saved successfully!')
//   }

//   const handlePlaceChanged = index => {
//     if (autocompleteRefs[index]) {
//       const place = autocompleteRefs[index].getPlace()

//       if (place.geometry && place.geometry.location) {
//         const location = place.geometry.location
//         const updatedLocations = [...locations]

//         updatedLocations[index] = {
//           ...updatedLocations[index],
//           lat: location.lat(),
//           lng: location.lng(),
//           address: place.formatted_address || '',
//           suggestions: [] // Clear suggestions once a place is selected
//         }

//         setLocations(updatedLocations)
//       }
//     }
//   }

//   const handleSuggestionClick = (index, suggestion) => {
//     const updatedLocations = [...locations]

//     updatedLocations[index] = {
//       ...updatedLocations[index],
//       address: suggestion, // Set address from the clicked suggestion
//       suggestions: [] // Clear suggestions after selection
//     }

//     setLocations(updatedLocations)
//   }

//   const addLocation = () => {
//     const newLocation = { address: '', lat: null, lng: null, suggestions: [], added: false }
//     setLocations([...locations, newLocation])
//   }

//   // Fetch categories from the database
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await axios.get('/api/categories') // Adjust endpoint as needed

//         setCategories(response.data)
//       } catch (error) {
//         console.error('Error fetching categories:', error)
//       }
//     }

//     fetchCategories()
//   }, [])

//   const handleAddPrice = () => {
//     if (selectedPricingCategory && person && amount && selectedCurrency) {
//       setFormData(prevFormData => ({
//         ...prevFormData,
//         prices: [
//           ...prevFormData.prices,
//           {
//             category: selectedPricingCategory,
//             name: person,
//             value: `${amount} ${selectedCurrency}`
//           }
//         ]
//       }))

//       setPerson('')
//       setAmount('')
//       setSelectedCurrency('HKD')
//       setSelectedPricingCategory('')
//     } else {
//       toast.error('Please fill out all fields before adding a price.')
//     }
//   }

//   const imageUrlsRef = useRef([])

//   const handleImageUpload = urls => {
//     console.log('Image URLs from SliderWithAddButton:', urls)
//     imageUrlsRef.current = urls
//     setFormData(prevData => ({
//       ...prevData,
//       imageUrls: urls
//     }))
//   }

//   const handleEditorChange = value => {
//     setEditorContent(value)
//     setFormData(prevFormData => ({
//       ...prevFormData,
//       about: value // Update formData's 'about' field with the new editor content
//     }))
//   }

//   const sliderRef = useRef()

//   const handleAddAgeRestriction = () => {
//     if (newAgeRestrictionDescription) {
//       setFormData({
//         ...formData,
//         ageRestrictions: [...formData.ageRestrictions, { description: newAgeRestrictionDescription }]
//       })
//       setNewAgeRestrictionDescription('')
//     }
//   }

//   const handleAddTermsConditions = () => {
//     if (newTermsConditionsDescription) {
//       setFormData({
//         ...formData,
//         termsConditions: [...formData.termsConditions, { description: newTermsConditionsDescription }]
//       })
//       setNewTermsConditionsDescription('')
//     }
//   }

//   const handleAddCancellationPolicy = () => {
//     if (newCancellationPolicyDescription) {
//       setFormData({
//         ...formData,
//         cancellationPolicies: [...formData.cancellationPolicies, { description: newCancellationPolicyDescription }]
//       })
//       setNewCancellationPolicyDescription('')
//     }
//   }

//   const monthNames = [
//     'January',
//     'February',
//     'March',
//     'April',
//     'May',
//     'June',
//     'July',
//     'August',
//     'September',
//     'October',
//     'November',
//     'December'
//   ]

//   const getMonthName = monthNumber => monthNames[monthNumber - 1] || ''
//   const monthNumber = parseInt(openingMonth, 10) // Assuming openingMonth is numeric
//   const monthName = getMonthName(monthNumber)

//   const newOpeningTime = {
//     openingTime: `${openingTime} ${amPm}`,
//     closingTime: `${closingTime} ${amPm}`,
//     month: monthName
//   }

//   const handleAddOpeningTime = () => {
//     if (openingTime && closingTime && openingMonth) {
//       const newOpeningTime = {
//         openingTime: `${openingTime} ${amPm}`,
//         closingTime: `${closingTime} ${amPm}`,
//         month: monthName
//       }

//       setFormData({
//         ...formData,
//         openingTimes: [...formData.openingTimes, newOpeningTime]
//       })

//       setOpeningTime('')
//       setClosingTime('')
//       setOpeningMonth('')
//       setAmPm('AM')
//     }
//   }

//   const handleRemove = (section, index) => {
//     const updatedList = formData[section].filter((_, i) => i !== index)

//     setFormData({ ...formData, [section]: updatedList })
//   }

//   const handleFormChange = (field, value) => {
//     if (field === 'categories' && typeof value === 'string') {
//       setFormData(prevFormData => ({
//         ...prevFormData,
//         [field]: value
//       }))
//     } else {
//       setFormData({ ...formData, [field]: value })
//     }
//   }

//   const handleSubmit = async e => {
//     e.preventDefault()
//     setIsSubmitting(true)

//     if (!sliderRef.current.validateImages()) {
//       setIsSubmitting(false)
//       return
//     }

//     // Clean up location data to include lat, lng, and address
//     const validLocations = locations
//       .filter(loc => loc.lat !== null && loc.lng !== null)
//       .map(loc => ({
//         lat: loc.lat,
//         lng: loc.lng,
//         address: loc.address // Include address in the final form data
//       }))

//     const updateData = {
//       title: formData.title,
//       description: formData.description,
//       about: formData.about,
//       rating: formData.rating,
//       categories: formData.categories,
//       locations: validLocations, // Assign cleaned-up locations array
//       prices: formData.prices.map(price => ({
//         category: price.category,
//         name: price.name,
//         value: price.value
//       })),
//       ageRestrictions: formData.ageRestrictions.map(restriction => ({
//         description: restriction.description
//       })),
//       termsConditions: formData.termsConditions.map(condition => ({
//         description: condition.description
//       })),
//       cancellationPolicies: formData.cancellationPolicies.map(policy => ({
//         description: policy.description
//       })),
//       openingTimes: formData.openingTimes.map(time => ({
//         openingTime: time.openingTime,
//         closingTime: time.closingTime,
//         month: time.month
//       })),
//       imageUrls: imageUrlsRef.current.map(url => ({ url })) // Use current image URLs
//     }

//     console.log('updateData', updateData)

//     try {
//       const response = id
//         ? await axios.put(`/api/itinerary/${id}`, updateData) // Update API call
//         : await axios.post('/api/itinerary/', updateData) // Create new accommodation

//       if (response.status === 200) {
//         toast.success(`itinerary ${id ? 'updated' : 'added'} successfully!`)
//         if (!id) {
//           resetForm() // Reset form fields after successful submission
//         }
//       } else {
//         toast.error(`Failed to ${id ? 'update' : 'add'} itinerary.`)
//       }
//     } catch (error) {
//       toast.error(`Failed to ${id ? 'update' : 'add'} itinerary.`)
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   if (isLoading) {
//     return <SkeletonLoader />
//   }

//   return (
//     <Card>
//       <CardContent className='mbe-5'>
//         <form onSubmit={handleSubmit}>
//           <Card variant='outlined' sx={cardStyles} className=' shadow-lg'>
//             <CardContent>
//               <Grid container spacing={12}>
//                 <Grid item xs={12}>
//                   <Grid container justifyContent='flex-start'>
//                     <Typography variant='h4' align='left'>
//                       Edit Hero Section
//                     </Typography>
//                   </Grid>
//                   <Grid container justifyContent='flex-start'>
//                     <Typography variant='h10' align='left'>
//                       Upload Images and Videos
//                     </Typography>
//                   </Grid>
//                 </Grid>
//                 <Grid item xs={12}>
//                   <Grid item xs={12}>
//                     <SliderWithAddButton
//                       ref={sliderRef}
//                       onUpload={handleImageUpload}
//                       imageUrls={imageUrls} // Add this line to pass the image URLs to the component
//                     />
//                   </Grid>
//                 </Grid>
//               </Grid>
//             </CardContent>
//           </Card>

//           <Grid container spacing={5}>
//             <Grid item xs={12} mt={4}>
//               <Card variant='outlined' sx={cardStyles} className=' shadow-lg'>
//                 <CardContent>
//                   <Typography variant='h6' className='mb-6'>
//                     Accomudation Title
//                   </Typography>
//                   <TextField
//                     required
//                     fullWidth
//                     label='Edit Title'
//                     placeholder='Add itinerary Name'
//                     value={formData.title}
//                     onChange={e => handleFormChange('title', e.target.value)}
//                   />
//                 </CardContent>
//               </Card>
//             </Grid>

//             {/* Categories */}

//             <Grid item xs={12}>
//               <Card variant='outlined' sx={cardStyles} className='my-9 shadow-lg'>
//                 <CardContent className='my-4'>
//                   <Typography variant='h6' className='mb-6'>
//                     Accomudation Type
//                   </Typography>
//                   <Select
//                     fullWidth
//                     value={formData.categories}
//                     onChange={e => handleFormChange('categories', e.target.value)}
//                     displayEmpty
//                   >
//                     <MenuItem value='' disabled>
//                       Select Type
//                     </MenuItem>
//                     {categories.map((category, index) => (
//                       <MenuItem key={index} value={category.name}>
//                         {category.name}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </CardContent>
//               </Card>
//             </Grid>
//             {/* Accomodation description */}

//             <Grid item xs={12} mt={4}>
//               <Card variant='outlined' sx={cardStyles} className='shadow-lg min-h-[300px]'>
//                 <CardContent>
//                   <Typography variant='h6' className='mb-6'>
//                     Description
//                   </Typography>
//                   <TextField
//                     required
//                     fullWidth
//                     multiline
//                     rows={6}
//                     label='Description'
//                     placeholder='Add description'
//                     value={formData.description}
//                     onChange={e => handleFormChange('description', e.target.value)}
//                   />
//                 </CardContent>
//               </Card>
//             </Grid>

//             {/* About */}
//             <Grid item xs={12} mt={4}>
//               <Card variant='outlined' sx={cardStyles} className='shadow-lg min-h-[300px]'>
//                 <CardContent>
//                   <Typography variant='h6' className='mb-6'>
//                     About
//                   </Typography>

//                   <RichTextEditor
//                     value={editorContent}
//                     onChange={handleEditorChange}
//                     modules={{
//                       toolbar: [
//                         [{ header: '1' }, { header: '2' }, { font: [] }], // Row 1
//                         [{ list: 'ordered' }, { list: 'bullet' }], // Row 2
//                         ['bold', 'italic', 'underline'], // Row 3
//                         ['link'], // Row 4
//                         [{ align: [] }], // Row 5
//                         ['clean'] // Row 6
//                       ]
//                     }}
//                     className='h-[150px]' // Use the important class
//                     style={{ minHeight: '150px' }} // Inline style as a fallback
//                   />
//                 </CardContent>
//               </Card>
//             </Grid>

//             {/* Price Entry Card */}
//             <Grid item xs={12}>
//               <PricingDetail
//                 formData={formData}
//                 setFormData={setFormData}
//                 handleRemove={handleRemove}
//                 pricingCategories={pricingCategories}
//                 selectedPricingCategory={selectedPricingCategory}
//                 setSelectedPricingCategory={setSelectedPricingCategory}
//                 person={person}
//                 setPerson={setPerson}
//                 amount={amount}
//                 setAmount={setAmount}
//                 selectedCurrency={selectedCurrency}
//                 setSelectedCurrency={setSelectedCurrency}
//                 handleAddPrice={handleAddPrice}
//                 currencies={currencies}
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <AgeRestriction
//                 formData={formData}
//                 setFormData={setFormData}
//                 handleRemove={handleRemove}
//                 newAgeRestrictionDescription={newAgeRestrictionDescription}
//                 setNewAgeRestrictionDescription={setNewAgeRestrictionDescription}
//                 handleAddAgeRestriction={handleAddAgeRestriction}
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <TermsConditions
//                 formData={formData}
//                 setFormData={setFormData}
//                 handleRemove={handleRemove}
//                 newTermsConditionsDescription={newTermsConditionsDescription}
//                 setNewTermsConditionsDescription={setNewTermsConditionsDescription}
//                 handleAddTermsConditions={handleAddTermsConditions}
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <CancellationPolicy
//                 formData={formData}
//                 setFormData={setFormData}
//                 handleRemove={handleRemove}
//                 newCancellationPolicyDescription={newCancellationPolicyDescription}
//                 setNewCancellationPolicyDescription={setNewCancellationPolicyDescription}
//                 handleAddCancellationPolicy={handleAddCancellationPolicy}
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <OpeningTimes
//                 formData={formData}
//                 setFormData={setFormData}
//                 handleRemove={handleRemove}
//                 openingTime={openingTime}
//                 setOpeningTime={setOpeningTime}
//                 closingTime={closingTime}
//                 setClosingTime={setClosingTime}
//                 openingMonth={openingMonth}
//                 setOpeningMonth={setOpeningMonth}
//                 amPm={amPm}
//                 setAmPm={setAmPm}
//                 handleAddOpeningTime={handleAddOpeningTime}
//                 getMonthName={getMonthName}
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <LocationCard
//                 locations={locations}
//                 setLocations={setLocations}
//                 autocompleteRefs={autocompleteRefs}
//                 setAutocompleteRefs={setAutocompleteRefs} // Pass setAutocompleteRefs as a prop
//                 addLocation={addLocation}
//                 removeLocation={removeLocation}
//                 handleLocationChange={handleLocationChange}
//                 handlePlaceChanged={handlePlaceChanged}
//                 handleSuggestionClick={handleSuggestionClick}
//                 saveAllLocations={saveAllLocations}
//               />
//             </Grid>

//             {/* Submit Button */}
//             <Grid item xs={12} mt={4} className=' flex justify-end mt-4 '>
//               <Button variant='contained' type='submit' disabled={isSubmitting}>
//                 {isSubmitting ? <CircularProgress size={24} color='inherit' /> : ' Update Accomudation'}
//               </Button>
//             </Grid>
//           </Grid>
//         </form>
//       </CardContent>
//       <Toaster />
//     </Card>
//   )
// }

// export default EditItinearary
