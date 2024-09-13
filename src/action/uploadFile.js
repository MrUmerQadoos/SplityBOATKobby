'use server'
import axios from 'axios'

const verifyToken = async token => {
  try {
    const response = await axios({
      method: 'GET',
      url: 'https://api.cloudflare.com/client/v4/user/tokens/verify',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    return response.data.success
  } catch (error) {
    console.error('Token verification failed:', error.response ? error.response.data : error.message)
    return false
  }
}

const uploadEditorImage = async base64Image => {
  console.log('inside server func>>>>>>>>>>>>>>>>>', base64Image.slice(0, 50) + '...')

  const API_TOKEN = process.env.NEXT_EDITOR_API_TOKEN

  // Verify the token first
  const isTokenValid = await verifyToken(API_TOKEN)
  if (!isTokenValid) {
    console.error('API token is invalid or expired')
    return null
  }

  // Extract the actual base64 data from the data URL
  const base64Data = base64Image.split(',')[1]

  // Convert base64 to buffer
  const imageBuffer = Buffer.from(base64Data, 'base64')

  const formData = new FormData()
  formData.append('file', new Blob([imageBuffer], { type: 'image/jpeg' }), 'uploaded-image.jpg')

  try {
    const response = await axios({
      method: 'POST',
      url: `https://api.cloudflare.com/client/v4/accounts/ddc147eb5e4cdd07d6f831083dcaaef6/images/v1`,
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        'Content-Type': 'multipart/form-data'
      },
      data: formData
    })

    if (response.data && response.data.result) {
      return response.data.result.variants[0] // Return the uploaded image URL
    } else {
      console.error('Failed to upload image: No URL returned')
      return null
    }
  } catch (error) {
    console.error('Error uploading image:', error.response ? error.response.data : error.message)
    return null
  }
}

export default uploadEditorImage
