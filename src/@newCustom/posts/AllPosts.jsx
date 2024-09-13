'use client'
import { useState } from 'react'

import Image from 'next/image'

import { Button, Grid } from '@mui/material'

import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

function createData(image, name, actions) {
  return { image, name, actions }
}

const rows = [
  createData(
    '/images/avatars/placeholderimage.jpg',
    ' Lost World Full Day Epic',
    <div className='flex gap-2 justify-end'>
      <Button variant='outlined' color='warning'>
        Edit
      </Button>
      <Button variant='outlined' color='error'>
        Delete
      </Button>
    </div>
  ),
  createData(
    '/images/avatars/placeholderimage.jpg',
    'Dart River Wilderness Jet Experience',
    <div className='flex gap-2 justify-end'>
      <Button variant='outlined' color='warning'>
        Edit
      </Button>
      <Button variant='outlined' color='error'>
        Delete
      </Button>
    </div>
  ),
  createData(
    '/images/avatars/placeholderimage.jpg',
    'KJet + Milford Sound Day Tour',
    <div className='flex gap-2 justify-end'>
      <Button variant='outlined' color='warning'>
        Edit
      </Button>
      <Button variant='outlined' color='error'>
        Delete
      </Button>
    </div>
  ),
  createData(
    '/images/avatars/placeholderimage.jpg',
    'Deep Canyon',
    <div className='flex gap-2 justify-end'>
      <Button variant='outlined' color='warning'>
        Edit
      </Button>
      <Button variant='outlined' color='error'>
        Delete
      </Button>
    </div>
  )
]

const AllPosts = ({ title }) => {
  return (
    <div className='shadow-lg px-6 py-6 rounded-md'>
      <div className='flex items-center justify-end mb-3'>
        <Button href={'/add-post'} fullWidth variant='outlined' className='w-[120px] float-end'>
          Add New
        </Button>
      </div>
      <Grid container spacing={6} className=''>
        <Grid item xs={12} md={12}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label='simple table'>
              <TableHead>
                <TableRow className=''>
                  <TableCell className='font-bold uppercase text-[18px]'>{title}</TableCell>
                  <TableCell align='right' className='font-bold uppercase text-[18px]'>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map(row => (
                  <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component='th' scope='row' className='flex items-center gap-2 font-bold text-[16px]'>
                      <Image src={row.image} height={80} width={80} className='rounded' /> {row.name}
                    </TableCell>

                    <TableCell align='right'>{row.actions}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </div>
  )
}

export default AllPosts
