// layout.js

import 'react-perfect-scrollbar/dist/css/styles.css'
import ProviderStore from '@/store/ProviderStore'

import NextTopLoader from 'nextjs-toploader'

// import SessionProviderWrapper from '@/app/SessionProviderWrapper'

import { ItineraryProvider } from '@/@customumer/Itinearary/ItineraryContext'

// Style Imports
import '@/app/globals.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'

export const metadata = {
  title: 'Splidty Boat Admin Dashboard',
  description: 'Admin can dynamically add data to Splidty Boat website'
}

const RootLayout = ({ children }) => {
  // Vars
  const direction = 'ltr'

  return (
    <ProviderStore>
      <html id='__next' dir={direction}>
        <body className='flex is-full min-bs-full flex-auto flex-col'>
          {/* Layout */}
          <NextTopLoader
            color='#2299DD'
            initialPosition={0.08}
            crawlSpeed={200}
            height={3}
            crawl={true}
            showSpinner={false}
            easing='ease'
            speed={200}
            shadow='0 0 10px #2299DD,0 0 5px #2299DD'
          />
          {/* <SessionProviderWrapper> */} {/* Use the client component here */}
          <ItineraryProvider>{children}</ItineraryProvider>
          {/* </SessionProviderWrapper> */}
        </body>
      </html>
    </ProviderStore>
  )
}

export default RootLayout
