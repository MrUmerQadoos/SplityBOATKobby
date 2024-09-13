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

const TermsConditions = ({
  formData,
  setFormData,
  handleRemove,
  newTermsConditionsDescription,
  setNewTermsConditionsDescription,
  handleAddTermsConditions
}) => (
  <Card variant='outlined'>
    <CardContent>
      <Typography variant='h6'>Terms and Conditions</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label='Description'
            placeholder='Terms and Conditions Description'
            multiline
            rows={4}
            value={newTermsConditionsDescription}
            onChange={e => setNewTermsConditionsDescription(e.target.value)}
          />
        </Grid>
      </Grid>
      <Grid item xs={12} className='flex justify-end mt-4'>
        <Button variant='contained' onClick={handleAddTermsConditions}>
          Add Terms and Conditions
        </Button>
      </Grid>
      <Typography variant='h6' className='mt-6'>
        Current Terms and Conditions
      </Typography>
      <List>
        {formData.termsConditions.length > 0 ? (
          formData.termsConditions.map((terms, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <IconButton edge='end' onClick={() => handleRemove('termsConditions', index)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText primary={terms.description} />
            </ListItem>
          ))
        ) : (
          <Typography variant='body2'>No terms and conditions added yet.</Typography>
        )}
      </List>
    </CardContent>
  </Card>
)

export default TermsConditions
