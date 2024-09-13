import React from 'react'

import toast, { Toaster } from 'react-hot-toast'

import {
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  List,
  ListItem,
  ListItemText
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

const PricingDetail = ({
  formData,
  setFormData,
  handleRemove,
  pricingCategories,
  selectedPricingCategory,
  setSelectedPricingCategory,
  person,
  setPerson,
  amount,
  setAmount,
  selectedCurrency,
  setSelectedCurrency,
  handleAddPrice,
  currencies
}) => (
  <Card variant='outlined'>
    <CardContent>
      <Typography variant='h6' classname=' mb-4'>
        Pricing Detail
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Select
            fullWidth
            value={selectedPricingCategory}
            onChange={e => setSelectedPricingCategory(e.target.value)}
            displayEmpty
          >
            <MenuItem value='' disabled>
              Select Pricing Category
            </MenuItem>
            {pricingCategories.map((category, index) => (
              <MenuItem key={index} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label='Add Person'
            placeholder='e.g. Adult(1-5)'
            value={person}
            onChange={e => setPerson(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label='Amount'
            placeholder='e.g. 880.00'
            value={amount}
            onChange={e => {
              const value = e.target.value
              // Regex pattern to allow only numbers and up to two decimal places
              if (/^\d*\.?\d{0,2}$/.test(value) || value === '') {
                setAmount(value)
              } else {
                toast.error('Please enter a number')
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <Select
                    value={selectedCurrency}
                    onChange={e => setSelectedCurrency(e.target.value)}
                    displayEmpty
                    sx={{ width: '100px', height: '40px', fontSize: '0.75rem' }}
                  >
                    {currencies.map((currency, index) => (
                      <MenuItem key={index} value={currency}>
                        {currency}
                      </MenuItem>
                    ))}
                  </Select>
                </InputAdornment>
              )
            }}
          />
        </Grid>
      </Grid>
      <Grid item xs={12} className='flex justify-end mt-4'>
        <Button variant='contained' onClick={handleAddPrice}>
          Add Price
        </Button>
      </Grid>
      <Typography variant='h6' className='mt-6'>
        Current Prices
      </Typography>
      <Grid container spacing={2}>
        {formData.prices.map((price, index) => (
          <Grid item key={index} xs={12} className='gap-x-8'>
            <ListItem style={{ display: 'flex', alignItems: 'center', padding: '8px' }}>
              <Grid container spacing={2} alignItems='center'>
                <Grid item xs={3} sm={3}>
                  <ListItemText primary={price.category} />
                </Grid>
                <Grid item xs={3} sm={3}>
                  <ListItemText primary={price.name} />
                </Grid>
                <Grid item xs={3} sm={3}>
                  <ListItemText primary={price.value} />
                </Grid>
                <Grid item xs={3} sm={3}>
                  <IconButton edge='end' onClick={() => handleRemove('prices', index)}>
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </ListItem>
          </Grid>
        ))}
      </Grid>
    </CardContent>
  </Card>
)

export default PricingDetail
