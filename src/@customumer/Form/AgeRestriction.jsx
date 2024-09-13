import React from 'react'
import {
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

const AgeRestriction = ({
  formData,
  setFormData,
  handleRemove,
  newAgeRestrictionDescription,
  setNewAgeRestrictionDescription,
  handleAddAgeRestriction
}) => (
  <Card variant='outlined'>
    <CardContent>
      <Typography variant='h6'>Age Restriction</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label='Description'
            placeholder='Age Restriction Description'
            multiline
            rows={4}
            value={newAgeRestrictionDescription}
            onChange={e => setNewAgeRestrictionDescription(e.target.value)}
          />
        </Grid>
      </Grid>
      <Grid item xs={12} className='flex justify-end mt-4'>
        <Button variant='contained' onClick={handleAddAgeRestriction}>
          Add Age Restriction
        </Button>
      </Grid>
      <Typography variant='h6' className='mt-6'>
        Current Age Restrictions
      </Typography>
      <List>
        {formData.ageRestrictions.length > 0 ? (
          formData.ageRestrictions.map((restriction, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <IconButton edge='end' onClick={() => handleRemove('ageRestrictions', index)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText primary={restriction.description} />
            </ListItem>
          ))
        ) : (
          <Typography variant='body2'>No age restrictions added yet.</Typography>
        )}
      </List>
    </CardContent>
  </Card>
)

export default AgeRestriction
