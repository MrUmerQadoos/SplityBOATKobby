// Skeleton.js
import { Grid, Card, CardContent, Skeleton, Typography } from '@mui/material'

const SkeletonLoader = () => {
  return (
    <Grid container spacing={5}>
      <Grid item xs={12}>
        <Card variant='outlined' sx={{ marginBottom: 2, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
          <CardContent>
            <Skeleton variant='text' width='60%' />
            <Skeleton variant='rectangular' height={200} sx={{ marginTop: 2 }} />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card variant='outlined' sx={{ marginBottom: 2, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
          <CardContent>
            <Typography variant='h6' className='mb-6'>
              <Skeleton variant='text' width='40%' />
            </Typography>
            <Skeleton variant='rectangular' height={100} />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card variant='outlined' sx={{ marginBottom: 2, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
          <CardContent>
            <Typography variant='h6' className='mb-6'>
              <Skeleton variant='text' width='40%' />
            </Typography>
            <Skeleton variant='rectangular' height={200} />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card variant='outlined' sx={{ marginBottom: 2, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
          <CardContent>
            <Typography variant='h6' className='mb-6'>
              <Skeleton variant='text' width='40%' />
            </Typography>
            <Skeleton variant='rectangular' height={100} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default SkeletonLoader
