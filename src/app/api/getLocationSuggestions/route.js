import axios from 'axios'

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const input = searchParams.get('input')

  if (!input) {
    return new Response(JSON.stringify({ message: 'Input is required' }), { status: 400 })
  }

  try {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}&types=geocode`
    )

    const suggestions = response.data.predictions.map(prediction => prediction.description)

    return new Response(JSON.stringify(suggestions), { status: 200 })
  } catch (error) {
    console.error('Error fetching location suggestions:', error)
    return new Response(JSON.stringify({ message: 'Error fetching location suggestions' }), { status: 500 })
  }
}
