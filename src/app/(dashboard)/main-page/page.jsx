import { Button, Grid } from '@mui/material'

import Explore from '@/@newCustom/place-to-visit/Explore'
import Experience from '@/@newCustom/place-to-visit/Experience'

// import FindThingsTodo from '@/@newCustom/place-to-visit/FindThingsTodo'
import InstagramLinkInput from '@/@customumer/Gallery/InstagramLinkInput'

import PlacesToVisitSlider from '@/@customumer/sliders/PlacesToVisitSlider'

const Page = () => {
  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <PlacesToVisitSlider />
        </Grid>
        <Grid item xs={12} md={12}>
          <Explore />
        </Grid>
        <Grid item xs={12} md={12}>
          <Experience />
        </Grid>
        <Grid item xs={12} md={12}>
          <InstagramLinkInput />
        </Grid>
      </Grid>
    </>
  )
}

export default Page
