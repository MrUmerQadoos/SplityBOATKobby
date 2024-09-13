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

const CancellationPolicy = ({
  formData,
  setFormData,
  handleRemove,
  newCancellationPolicyDescription,
  setNewCancellationPolicyDescription,
  handleAddCancellationPolicy
}) => (
  <Card variant='outlined'>
    <CardContent>
      <Typography variant='h6'>Cancellation Policy</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label='Description'
            placeholder='Cancellation Policy Description'
            multiline
            rows={4}
            value={newCancellationPolicyDescription}
            onChange={e => setNewCancellationPolicyDescription(e.target.value)}
          />
        </Grid>
      </Grid>
      <Grid item xs={12} className='flex justify-end mt-4'>
        <Button variant='contained' onClick={handleAddCancellationPolicy}>
          Add Cancellation Policy
        </Button>
      </Grid>
      <Typography variant='h6' className='mt-6'>
        Current Cancellation Policies
      </Typography>
      <List>
        {formData.cancellationPolicies.length > 0 ? (
          formData.cancellationPolicies.map((policy, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <IconButton edge='end' onClick={() => handleRemove('cancellationPolicies', index)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText primary={policy.description} />
            </ListItem>
          ))
        ) : (
          <Typography variant='body2'>No cancellation policies added yet.</Typography>
        )}
      </List>
    </CardContent>
  </Card>
)

export default CancellationPolicy
