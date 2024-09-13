// userSlice.jsx
import { createSlice } from '@reduxjs/toolkit'
import { userLogin, userLogout } from '../user/userThunk'

const initialState = {
  authUser: null,
  token: null,
  loading: false,
  error: null
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: builder => {
    // User Login
    builder
      .addCase(userLogin.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.loading = false
        state.authUser = action.payload.user
        state.token = action.payload.token
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to login'
      })
    // User Logout
    builder
      .addCase(userLogout.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(userLogout.fulfilled, state => {
        state.loading = false
        state.authUser = null
        state.token = null
      })
      .addCase(userLogout.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to logout'
      })
  }
})

export default userSlice.reducer

// import { createSlice } from '@reduxjs/toolkit'
// import {
//   userLogin,
//   userLogout // Make sure this matches the actual thunk export
// } from '../user/userThunk'
// const initialState = {
//   authUser: {}
// }
// export const itinerarySlice = createSlice({
//   name: 'itinerary',
//   initialState,
//   reducers: {},
//   extraReducers: builder => {
//     // User Login
//     builder
//       .addCase(userLogin.pending, state => {
//         state.loading = true
//         state.error = null
//       })
//       .addCase(userLogin.fulfilled, (state, action) => {
//         state.loading = false
//         state.authUser = action.payload
//       })
//       .addCase(userLogin.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.payload || 'Failed to login'
//       })
//     // User Logout
//     builder
//       .addCase(userLogout.pending, state => {
//         state.loading = true
//         state.error = null
//       })
//       .addCase(userLogout.fulfilled, state => {
//         state.loading = false
//         state.authUser = null
//       })
//       .addCase(userLogout.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.payload || 'Failed to logout'
//       })
//   }
// })
// export default itinerarySlice.reducer
