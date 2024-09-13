// userThunk.jsx
import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import Cookies from 'js-cookie'

export const userLogin = createAsyncThunk('user/login', async ({ email, password, onSuccess }, thunkAPI) => {
  try {
    const response = await axios.post('/api/login', { email, password })
    if (response.status === 200) {
      // Set cookie with the token
      Cookies.set('authToken', response.data.token, { expires: 7, secure: true, sameSite: 'strict' })
      if (onSuccess) onSuccess()
      return { user: response.data.user, token: response.data.token }
    } else {
      return thunkAPI.rejectWithValue('Failed to login')
    }
  } catch (error) {
    console.error('Error during login:', error)
    return thunkAPI.rejectWithValue(error.response?.data || error.message)
  }
})

export const userLogout = createAsyncThunk('user/logout', async (_, thunkAPI) => {
  try {
    // Remove the auth cookie
    Cookies.remove('authToken')

    return { message: 'Logged out successfully' }

    // Call logout API endpoint
    // const response = await axios.post('/api/logout-user')
    // if (response.status === 200) {
    //   return response.data
    // } else {
    //   return thunkAPI.rejectWithValue('Failed to log out')
    // }
  } catch (error) {
    return thunkAPI.rejectWithValue('Failed to log out')
  }
})

// export const checkAuthState = createAsyncThunk('user/checkAuth', async (_, thunkAPI) => {
//   const token = Cookies.get('authToken')
//   if (token) {
//     // You might want to validate the token here
//     return { token }
//   }
//   return null
// })

// import { createAsyncThunk } from '@reduxjs/toolkit'
// import axios from 'axios'

// export const userLogin = createAsyncThunk('login/userLogin', async ({ email, password, onSuccess }, thunkAPI) => {
//   try {
//     const { data, status } = await axios.post('/api/login', {
//       email,
//       password
//     })
//     if (status === 200) {
//       onSuccess()
//       return data
//     } else {
//       return thunkAPI.rejectWithValue('Failed to login')
//     }
//   } catch (error) {
//     console.error('Error during login:', error)
//     return thunkAPI.rejectWithValue(error.response?.data || error.message)
//   }
// })
// // Thunk for fetching itineraries
// export const userLogout = createAsyncThunk('login/userLogout', async (_, thunkAPI) => {
//   try {
//     const { data, status } = await axios.post('/api/logout-user')
//     if (status === 200) {
//       return data
//     } else {
//       return thunkAPI.rejectWithValue('Failed to log out')
//     }
//   } catch (error) {
//     return thunkAPI.rejectWithValue(error.response?.data || error.message)
//   }
// })
