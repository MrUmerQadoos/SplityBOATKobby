'use client'

import React from 'react'
import { Grid, Card, CardContent, Typography, Skeleton } from '@mui/material'

const SkeletonCard = () => (
  <Card
    sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%',
      transition: 'transform 0.2s',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 6px 25px rgba(0, 0, 0, 0.15)'
      }
    }}
  >
    <CardContent
      sx={{
        padding: '16px',
        textAlign: 'center'
      }}
    >
      <Skeleton variant='rectangular' width='100%' height={150} sx={{ borderRadius: '8px', marginBottom: '16px' }} />
      <Skeleton variant='text' width='60%' sx={{ marginBottom: '16px', fontWeight: 'bold' }} />
      <div
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%'
        }}
      >
        <Skeleton variant='text' width='40%' height={36} sx={{ marginRight: '8px', flexGrow: 1 }} />
        <Skeleton variant='text' width='40%' height={36} sx={{ flexGrow: 1 }} />
      </div>
    </CardContent>
  </Card>
)

const SkeletonList = () => (
  <Grid container spacing={3}>
    {Array.from({ length: 6 }).map((_, index) => (
      <Grid item xs={12} sm={6} md={4} key={index}>
        <SkeletonCard />
      </Grid>
    ))}
  </Grid>
)

export default SkeletonList
