// MUI Imports
import Grid from '@mui/material/Grid'

import FormLayoutsBasic from '@views/form-layouts/FormLayoutsBasic'

// import BannerLayout from '@views/banner-card/BannerLayout'
import LandscapceCard from '@/@customumer/LandscapceCard'
import TodoSlider from '@/@customumer/sliders/TodoSlider'
import ThingsTodo from '@/@customumer/ThingsTodo'

const ThingsToDo = () => (
  <Grid container spacing={12}>
    <Grid item xs={12}>
      <TodoSlider />
    </Grid>
    <Grid item xs={12}>
      <ThingsTodo />
    </Grid>
  </Grid>
)

export default ThingsToDo
