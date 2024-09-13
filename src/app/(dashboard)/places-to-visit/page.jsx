// MUI Imports
import Grid from '@mui/material/Grid'

// import BannerLayout from '@views/banner-card/BannerLayout'

import LandscapceCard from '@/@customumer/LandscapceCard'
import FindAccommodationSlider from '@/@customumer/sliders/FindAccommodationSlider'

import ThingsToDoHK from '@/@newCustom/find-accommodation/ThingsToDoHK'
import TopPlacesToVisit from '@/@newCustom/find-accommodation/TopPlacesToVisit'

import FormLayoutsBasic from '@views/form-layouts/FormLayoutsBasic'

const PlanYourTrip = () => (
  <Grid container spacing={12}>
    <Grid item xs={12}>
      <FindAccommodationSlider />
    </Grid>
    <Grid item xs={12}>
      <TopPlacesToVisit />
    </Grid>
    <Grid item xs={12}>
      <ThingsToDoHK />
    </Grid>
  </Grid>
)

export default PlanYourTrip
