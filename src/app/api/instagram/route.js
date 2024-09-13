// pages/api/instagram.js
import axios from 'axios'
import fs from 'fs'
import path from 'path'
import os from 'os'

const INSTAGRAM_GRAPH_API_URL = 'https://graph.instagram.com'
const ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  const { link } = req.body

  try {
    // Extract the media ID from the Instagram link
    const mediaId = extractMediaId(link)

    // Fetch media data from Instagram Graph API
    const mediaData = await fetchMediaData(mediaId)

    // Get the image URL (use carousel_album if it's a multi-image post)
    const imageUrl =
      mediaData.media_type === 'CAROUSEL_ALBUM' ? mediaData.children.data[0].media_url : mediaData.media_url

    // Download the image
    const imageResponse = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`
      }
    })
    const buffer = Buffer.from(imageResponse.data, 'binary')

    // Save to temp file
    const tempFilePath = path.join(os.tmpdir(), `instagram-${Date.now()}.jpg`)
    fs.writeFileSync(tempFilePath, buffer)

    res.status(200).json({ tempFilePath, mediaData })
  } catch (error) {
    console.error('Error processing Instagram post:', error)
    res.status(500).json({ message: 'Error processing Instagram post' })
  }
}

async function fetchMediaData(mediaId) {
  const response = await axios.get(`${INSTAGRAM_GRAPH_API_URL}/${mediaId}`, {
    params: {
      fields: 'id,media_type,media_url,thumbnail_url,permalink,timestamp,caption,children{media_url}',
      access_token: ACCESS_TOKEN
    }
  })
  return response.data
}

function extractMediaId(link) {
  // This is a simple extraction and might need to be adjusted based on the exact format of your Instagram links
  const match = link.match(/\/p\/([^\/]+)/)
  if (!match) throw new Error('Invalid Instagram link')
  return match[1]
}
