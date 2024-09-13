import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import LinkCard from '@/@customumer/wild/LinkCard'

import LandscapceCard from '@/@customumer/LandscapceCard'
import PotraitCard from '@/@customumer/PotraitCard'


const BookNow = () => (
  <Card className=' p-10'>
    {/* Heading at the top right */}

    <Grid container spacing={5}>
      {/* <Grid item xs={12}>
        <SliderWithAddButton />
      </Grid> */}

      {/* Heading at the top right */}
      <Grid item xs={12}>
        <Grid container justifyContent='flex-start'>
          <Typography variant='h4' align='left' style={{ marginBottom: '20px' }}>
            Book Now
          </Typography>
        </Grid>
      </Grid>

      <Grid item xs={12} md={12} lg={6}>
        <LinkCard />
      </Grid>

      <Grid item xs={12}>
        <Grid container justifyContent='flex-end'>
          <Button variant='contained' color='primary' style={{ marginTop: '20px' }}>
            Save
          </Button>
        </Grid>
      </Grid>
    </Grid>
  </Card>
)

export default BookNow
