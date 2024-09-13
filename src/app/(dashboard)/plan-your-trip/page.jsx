// MUI Imports
import Grid from '@mui/material/Grid'

// import BannerLayout from '@views/banner-card/BannerLayout'

import LandscapceCard from '@/@customumer/LandscapceCard'
import PlacesToVisitSlider from '@/@customumer/sliders/PlacesToVisitSlider'

import TopPlacesToVisit from '@/@customumer/PlanYourTrip/TopPlacesToVisit'
import InterestedIn from '@/@customumer/PlanYourTrip/InterestedIn'
import PlanYourTripSlider from '@/@customumer/sliders/PlanYourTripSlider'

import FormLayoutsBasic from '@views/form-layouts/FormLayoutsBasic'

const PlanYourTrip = () => (
  <Grid container spacing={12}>
    <Grid item xs={12}>
      <PlanYourTripSlider />
    </Grid>
    <Grid item xs={12}>
      <TopPlacesToVisit />
    </Grid>
    <Grid item xs={12}>
      <InterestedIn />
    </Grid>
  </Grid>
)

export default PlanYourTrip
