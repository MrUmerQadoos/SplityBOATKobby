// MUI Imports
import Grid from '@mui/material/Grid'

import BannerSlider from '@/@customumer/sliders/TodoSlider'

import BookNow from '@/@customumer/wild/BookNow'

import YouMayAlsoBeInterestedIn from '@/@customumer/wild/YouMayAlsoBeInterestedIn'
import InterestedIn from '@/@customumer/PlanYourTrip/InterestedIn'

const Wild = () => (
  <Grid container spacing={12}>
    <Grid item xs={12}>
      <BannerSlider />
    </Grid>
    <Grid item xs={12}>
      <YouMayAlsoBeInterestedIn />
    </Grid>
    <Grid item xs={12}>
      <BookNow />
    </Grid>
    <InterestedIn />
    <Grid item xs={12}></Grid>
  </Grid>
)

export default Wild
