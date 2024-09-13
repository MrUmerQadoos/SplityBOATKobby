const nextConfig = {
  reactStrictMode: false,
  swcMinify: true, // Enable this to use faster SWC compiler minification

  // Increase API Route Payload Size (if needed)
  api: {
    bodyParser: {
      sizeLimit: '100mb', // Increase body size limit for large uploads
    },
  },

  // Add headers if necessary (for CORS or security)
  async headers() {
    return [
      {
        source: "/(.*)", // Apply to all routes
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*", // Adjust CORS as per your need
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: false,
      },
    ];
  }
}

export default nextConfig;




// /** @type {import('next').NextConfig} */
// const nextConfig = {


//   reactStrictMode: false,

//   async redirects() {
//     return [
//       {
//         source: '/',
//         destination: '/login',
//         permanent: false
//       }
//     ]
//   }
// }

// export default nextConfig
