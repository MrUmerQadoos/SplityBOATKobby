'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import {
  Card,
  CardContent,
  Typography,
  TextField,
  IconButton,
  InputAdornment,
  Button,
  CircularProgress,
  Box
} from '@mui/material'
import { userLogin } from '@/store/user/userThunk'
import toast, { Toaster } from 'react-hot-toast'
import Link from '@/components/Link'

const Login = () => {
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const router = useRouter()
  const { loading, error } = useSelector(state => state.user) // Adjust selector to match your state

  useEffect(() => {
    if (error) {
      toast.error('Invalid email or password. Please try again.')
    }
  }, [error])

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const handleSubmit = async e => {
    e.preventDefault()

    dispatch(
      userLogin({
        email,
        password,
        onSuccess: () => {
          router.push('/main')
          toast.success('Login successful!')
        }
      })
    )
  }

  return (
    <div className='flex flex-col justify-center items-center min-h-screen relative p-6'>
      <Toaster />
      <Card className='flex flex-col sm:w-[450px] relative'>
        {loading && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              backgroundColor: 'rgba(255, 255, 255, 0.8)'
            }}
          >
            <CircularProgress />
          </Box>
        )}
        <CardContent className='p-6 sm:p-12 relative'>
          <div className='flex justify-center items-center mb-6'>
            <Typography variant='h4'>{`Welcome Back! 👋🏻`}</Typography>
          </div>

          <form noValidate autoComplete='off' onSubmit={handleSubmit} className='flex flex-col gap-5'>
            <TextField
              autoFocus
              fullWidth
              label='Email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={loading}
            />
            <TextField
              fullWidth
              label='Password'
              type={isPasswordShown ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      size='small'
                      edge='end'
                      onClick={handleClickShowPassword}
                      onMouseDown={e => e.preventDefault()}
                      disabled={loading}
                    >
                      <i className={isPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <Button fullWidth variant='contained' type='submit' disabled={loading}>
              Log In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login

// 'use client'

// import { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { useDispatch, useSelector } from 'react-redux'
// import { signIn } from 'next-auth/react'

// import Card from '@mui/material/Card'
// import CardContent from '@mui/material/CardContent'
// import Typography from '@mui/material/Typography'
// import TextField from '@mui/material/TextField'
// import IconButton from '@mui/material/IconButton'
// import InputAdornment from '@mui/material/InputAdornment'
// import Checkbox from '@mui/material/Checkbox'
// import Button from '@mui/material/Button'
// import FormControlLabel from '@mui/material/FormControlLabel'
// import CircularProgress from '@mui/material/CircularProgress'
// import Box from '@mui/material/Box'

// import { userLogin } from '@/store/user/userThunk'
// import toast, { Toaster } from 'react-hot-toast'
// import Link from '@/components/Link'

// const Login = () => {
//   const [isPasswordShown, setIsPasswordShown] = useState(false)
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const dispatch = useDispatch()
//   const router = useRouter()
//   const { loading, error } = useSelector(state => state.user)

//   const handleClickShowPassword = () => setIsPasswordShown(show => !show)

//   const handleSubmit = async e => {
//     e.preventDefault()

//     dispatch(
//       userLogin({
//         email,
//         password,
//         onSuccess: () => {
//           router.push('/main')
//           toast.success('Login successful!')
//         },
//         onError: () => {}
//       })
//     ) // Dispatch login request action
//     // const result = await signIn('credentials', {
//     //   redirect: false,
//     //   email,
//     //   password
//     // })

//     // if (result.ok) {
//     //   const homeUrl =
//     //     process.env.NEXT_PUBLIC_PATH === 'production'
//     //       ? 'https://splitdyboat-admin.vercel.app/'
//     //       : 'http://localhost:3000/'

//     //   dispatch(loginSuccess({ email })) // Dispatch login success action with user data
//     //   router.push(homeUrl)
//     //   toast.success('Login successful!')
//     // } else {
//     //   dispatch(loginFailure('Incorrect username or password. Please try again.')) // Dispatch login failure action with error message
//     //   toast.error('Incorrect username or password. Please try again.')
//     // }
//   }

//   return (
//     <div className='flex flex-col justify-center items-center min-h-screen relative p-6'>
//       <Toaster />
//       <Card className='flex flex-col sm:w-[450px] relative'>
//         {loading && (
//           <Box
//             sx={{
//               position: 'absolute',
//               top: 0,
//               left: 0,
//               right: 0,
//               bottom: 0,
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               zIndex: 10,
//               backgroundColor: 'rgba(255, 255, 255, 0.8)'
//             }}
//           >
//             <CircularProgress />
//           </Box>
//         )}
//         <CardContent className='p-6 sm:p-12 relative'>
//           <div className='flex justify-center items-center mb-6'>
//             <Typography variant='h4'>{`Welcome Back! 👋🏻`}</Typography>
//           </div>

//           <form noValidate autoComplete='off' onSubmit={handleSubmit} className='flex flex-col gap-5'>
//             <TextField
//               autoFocus
//               fullWidth
//               label='Email'
//               value={email}
//               onChange={e => setEmail(e.target.value)}
//               disabled={loading}
//             />
//             <TextField
//               fullWidth
//               label='Password'
//               type={isPasswordShown ? 'text' : 'password'}
//               value={password}
//               onChange={e => setPassword(e.target.value)}
//               disabled={loading}
//               InputProps={{
//                 endAdornment: (
//                   <InputAdornment position='end'>
//                     <IconButton
//                       size='small'
//                       edge='end'
//                       onClick={handleClickShowPassword}
//                       onMouseDown={e => e.preventDefault()}
//                       disabled={loading}
//                     >
//                       <i className={isPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
//                     </IconButton>
//                   </InputAdornment>
//                 )
//               }}
//             />
//             <div className='flex justify-between items-center gap-x-3 gap-y-1 flex-wrap'>
//               <FormControlLabel control={<Checkbox disabled={loading} />} label='Remember me' />
//               <Typography className='text-end' color='primary' component={Link} href='/forgot-password'>
//                 Forgot password?
//               </Typography>
//             </div>
//             <Button fullWidth variant='contained' type='submit' disabled={loading}>
//               Log In
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

// export default Login

// // 'use client'

// // import { useState, useEffect } from 'react'

// // import { useRouter } from 'next/navigation'

// // import Link from 'next/link'

// // import { signIn } from 'next-auth/react'

// // import Card from '@mui/material/Card'

// // import CardContent from '@mui/material/CardContent'
// // import Typography from '@mui/material/Typography'
// // import TextField from '@mui/material/TextField'
// // import IconButton from '@mui/material/IconButton'
// // import InputAdornment from '@mui/material/InputAdornment'
// // import Checkbox from '@mui/material/Checkbox'
// // import Button from '@mui/material/Button'
// // import FormControlLabel from '@mui/material/FormControlLabel'
// // import Divider from '@mui/material/Divider'
// // import Alert from '@mui/material/Alert'
// // import CircularProgress from '@mui/material/CircularProgress'
// // import Box from '@mui/material/Box'
// // import toast, { Toaster } from 'react-hot-toast' // Import toast and Toaster

// // const Login = () => {
// //   const [isPasswordShown, setIsPasswordShown] = useState(false)
// //   const [email, setEmail] = useState('')
// //   const [password, setPassword] = useState('')
// //   const [loading, setLoading] = useState(false) // State for managing loading spinner
// //   const router = useRouter()

// //   const handleClickShowPassword = () => setIsPasswordShown(show => !show)

// //   const handleSubmit = async e => {
// //     e.preventDefault()
// //     setLoading(true) // Start loading

// //     const result = await signIn('credentials', {
// //       redirect: false, // Handle redirection manually
// //       email,
// //       password
// //     })

// //     if (result.ok) {
// //       const homeUrl =
// //         process.env.NEXT_PUBLIC_PATH === 'production'
// //           ? 'https://splitdyboat-admin.vercel.app/'
// //           : 'http://localhost:3000/'

// //       router.push(homeUrl)
// //       toast.success('Login successful!') // Show success toast
// //     } else {
// //       setLoading(false) // Stop loading if login fails
// //       toast.error('Incorrect username or password. Please try again.') // Show error toast
// //     }
// //   }

// //   return (
// //     <div className='flex flex-col justify-center items-center min-h-screen relative p-6'>
// //       <Toaster /> {/* Include the Toaster component */}
// //       <Card className='flex flex-col sm:w-[450px] relative'>
// //         {loading && (
// //           <Box
// //             sx={{
// //               position: 'absolute',
// //               top: 0,
// //               left: 0,
// //               right: 0,
// //               bottom: 0,
// //               display: 'flex',
// //               alignItems: 'center',
// //               justifyContent: 'center',
// //               zIndex: 10,
// //               backgroundColor: 'rgba(255, 255, 255, 0.8)' // Semi-transparent background
// //             }}
// //           >
// //             <CircularProgress />
// //           </Box>
// //         )}
// //         <CardContent className='p-6 sm:p-12 relative'>
// //           <div className='flex justify-center items-center mb-6'>
// //             <Typography variant='h4'>{`Welcome Back! 👋🏻`}</Typography>
// //           </div>

// //           <form noValidate autoComplete='off' onSubmit={handleSubmit} className='flex flex-col gap-5'>
// //             <TextField
// //               autoFocus
// //               fullWidth
// //               label='Email'
// //               value={email}
// //               onChange={e => setEmail(e.target.value)}
// //               disabled={loading} // Disable the input when loading
// //             />
// //             <TextField
// //               fullWidth
// //               label='Password'
// //               type={isPasswordShown ? 'text' : 'password'}
// //               value={password}
// //               onChange={e => setPassword(e.target.value)}
// //               disabled={loading} // Disable the input when loading
// //               InputProps={{
// //                 endAdornment: (
// //                   <InputAdornment position='end'>
// //                     <IconButton
// //                       size='small'
// //                       edge='end'
// //                       onClick={handleClickShowPassword}
// //                       onMouseDown={e => e.preventDefault()}
// //                       disabled={loading} // Disable the button when loading
// //                     >
// //                       <i className={isPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
// //                     </IconButton>
// //                   </InputAdornment>
// //                 )
// //               }}
// //             />
// //             <div className='flex justify-between items-center gap-x-3 gap-y-1 flex-wrap'>
// //               <FormControlLabel control={<Checkbox disabled={loading} />} label='Remember me' />
// //               <Typography className='text-end' color='primary' component={Link} href='/forgot-password'>
// //                 Forgot password?
// //               </Typography>
// //             </div>
// //             <Button fullWidth variant='contained' type='submit' disabled={loading}>
// //               Log In
// //             </Button>
// //             {/* <div className='flex justify-center items-center flex-wrap gap-2'>
// //               <Typography>New on our platform?</Typography>
// //               <Typography component={Link} href='/register' color='primary'>
// //                 Create an account
// //               </Typography>
// //             </div>
// //             <Divider className='my-4'>or</Divider>
// //             <div className='flex justify-center items-center gap-2'>
// //               <IconButton size='small' className='text-facebook' disabled={loading}>
// //                 <i className='ri-facebook-fill' />
// //               </IconButton>
// //               <IconButton size='small' className='text-twitter' disabled={loading}>
// //                 <i className='ri-twitter-fill' />
// //               </IconButton>
// //               <IconButton size='small' className='text-github' disabled={loading}>
// //                 <i className='ri-github-fill' />
// //               </IconButton>
// //               <IconButton size='small' className='text-googlePlus' disabled={loading}>
// //                 <i className='ri-google-fill' />
// //               </IconButton>
// //             </div> */}
// //           </form>
// //         </CardContent>
// //       </Card>
// //     </div>
// //   )
// // }

// // export default Login
