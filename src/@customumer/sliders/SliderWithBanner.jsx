import { useState, useCallback, useEffect, forwardRef, useImperativeHandle, useRef, useMemo } from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import { IoAddCircleSharp } from 'react-icons/io5';
import { useDropzone } from 'react-dropzone';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import BannnerCard from './BannnerCard';
import { toast } from 'react-hot-toast';

const MAX_VIDEO_SIZE_MB = 100 * 1024 * 1024; // 100MB

const SliderWithBanner = forwardRef(({ imageUrls = [], onUpload }, ref) => {
  const [cards, setCards] = useState([]);
  const [allImageUrls, setAllImageUrls] = useState(imageUrls);
  const [isUploading, setIsUploading] = useState(false);
  const imageUrlsRef = useRef(allImageUrls);
  const [uploadingStatuses, setUploadingStatuses] = useState([]);

  // Memoize S3Client for Cloudflare R2
  const s3 = useMemo(() => {
    return new S3Client({
      region: 'auto', // Cloudflare R2 does not require a specific region
      endpoint: process.env.NEXT_PUBLIC_R2_ENDPOINT, // Your R2 endpoint
      credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.NEXT_PUBLIC_R2_SECRET_ACCESS_KEY,
      },
    });
  }, []);

  useImperativeHandle(ref, () => ({
    resetSlider() {
      setCards([]);
      setAllImageUrls([]);
      imageUrlsRef.current = [];
      onUpload([]);
      setIsUploading(false); // Reset the uploading state when resetting
    },
    validateImages() {
      if (imageUrlsRef.current.length === 0) {
        toast.error('Please upload at least one image or video before submitting.');
        return false;
      }
      return true;
    },
  }));

  useEffect(() => {
    if (imageUrls.length > 0) {
      const existingCards = imageUrls.map(url => ({
        preview: url,
        type: url.match(/\.(jpeg|jpg|gif|png|webp|jfif)$/i) ? 'image' : 'video',
      }));
      setCards(existingCards);
      setAllImageUrls(imageUrls);
      imageUrlsRef.current = imageUrls;
    }
  }, [imageUrls]);

  const onDrop = useCallback(
    async (acceptedFiles) => {
      setIsUploading(true); // Start uploading state
      const newImageUrls = [];
      const newUploadingStatuses = [...uploadingStatuses];

      const filePromises = acceptedFiles.map(async (file, index) => {
        newUploadingStatuses[index] = true;
        setUploadingStatuses([...newUploadingStatuses]);

        // Check for file size
        if (file.size > MAX_VIDEO_SIZE_MB) {
          toast.error('File size exceeds 100MB. Please upload a smaller file.');
          newUploadingStatuses[index] = false;
          setUploadingStatuses([...newUploadingStatuses]);
          return;
        }

        try {
          const uniqueFileName = `${crypto.randomUUID()}-${file.name}`; // Create a unique file name

          // Create a new command to upload the file directly to R2
          const uploadCommand = new PutObjectCommand({
            Bucket: process.env.NEXT_PUBLIC_R2_BUCKET_NAME,
            Key: uniqueFileName,
            Body: file,
            ContentType: file.type,
            ACL: 'public-read', // Ensure the file is publicly accessible
          });

          // Upload the file directly to Cloudflare R2
          await s3.send(uploadCommand);

          // Generate the file URL after upload
          const fileUrl = `${process.env.NEXT_PUBLIC_R2_ENDPOINT}/${uniqueFileName}`;
          console.log('File uploaded successfully:', fileUrl);

          newImageUrls.push(fileUrl);

          // Update image URLs and cards
          setAllImageUrls((prevUrls) => {
            const updatedUrls = [...prevUrls, fileUrl];
            imageUrlsRef.current = updatedUrls;
            onUpload(updatedUrls); // Call the onUpload callback with the updated URLs
            return updatedUrls;
          });

          setCards((prevCards) => [
            ...prevCards,
            { preview: URL.createObjectURL(file), type: file.type.includes('video') ? 'video' : 'image' },
          ]);

          toast.success(`File uploaded: ${file.name}`);
        } catch (error) {
          console.error('Error uploading file:', error);
          toast.error(`Failed to upload ${file.name}`);
        } finally {
          newUploadingStatuses[index] = false;
          setUploadingStatuses([...newUploadingStatuses]);
        }
      });

      await Promise.all(filePromises);
      setIsUploading(false); // Stop the global loader after all files are processed
    },
    [onUpload, uploadingStatuses, s3]
  );

  const handleDeleteCard = (index) => {
    const updatedCards = cards.filter((_, i) => i !== index);
    const updatedImageUrls = allImageUrls.filter((_, i) => i !== index);

    setCards(updatedCards);
    setAllImageUrls(updatedImageUrls);
    imageUrlsRef.current = updatedImageUrls;
    onUpload(updatedImageUrls);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*,video/*', // Accept both images and videos
  });

  return (
    <div style={{ padding: '20px' }}>
      <Grid container spacing={3}>
        {cards.map((file, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <BannnerCard
              file={file}
              onDelete={() => handleDeleteCard(index)}
              onPreview={() => console.log('Preview image or video')}
              isUploading={uploadingStatuses[index]} // Pass the correct uploading status
            />
          </Grid>
        ))}
        <Grid item xs={12} sm={6} md={4} className="min-h-[200px]">
          <Card
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px dotted #ddd',
              borderRadius: '12px',
              cursor: isUploading ? 'not-allowed' : 'pointer',
              minHeight: '200px',
              padding: '16px',
            }}
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            {isUploading ? (
              <CircularProgress />
            ) : (
              <>
                {isDragActive ? <p>Drop the files here ...</p> : <p>Drag & Upload</p>}
                <IoAddCircleSharp style={{ fontSize: '36px', color: '#4a90e2' }} />
              </>
            )}
          </Card>

        </Grid>
      </Grid>

      <style jsx global>{`
        .modern-loader {
          border: 8px solid rgba(0, 0, 0, 0.1);
          border-radius: 50%;
          border-top: 8px solid #4a90e2;
          width: 60px;
          height: 60px;
          animation: spin 1.5s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
})

export default SliderWithBanner

// import { useState, useCallback, useEffect, forwardRef, useImperativeHandle, useRef } from 'react'
// import Grid from '@mui/material/Grid'
// import Card from '@mui/material/Card'
// import CircularProgress from '@mui/material/CircularProgress'
// import { IoAddCircleSharp } from 'react-icons/io5'
// import { useDropzone } from 'react-dropzone'
// import BannnerCard from './BannnerCard'
// import { toast } from 'react-hot-toast'

// // Utility function to validate image size
// const isValidImageSize = (width, height) => {
//   // return width === 3840 && height === 2171
//   return true // Or implement a different validation logic
// }

// const MAX_VIDEO_SIZE_MB = 500 * 1024 * 1024 // 500MB

// const SliderWithBanner = forwardRef(({ imageUrls = [], onUpload }, ref) => {
//   const [cards, setCards] = useState([])
//   const [allImageUrls, setAllImageUrls] = useState(imageUrls)
//   const [isUploading, setIsUploading] = useState(false)
//   const imageUrlsRef = useRef(allImageUrls)
//   const [uploadingStatuses, setUploadingStatuses] = useState([])

//   useImperativeHandle(ref, () => ({
//     resetSlider() {
//       setCards([])
//       setAllImageUrls([])
//       imageUrlsRef.current = []
//       onUpload([])
//       setIsUploading(false) // Reset the uploading state when resetting
//     },
//     validateImages() {
//       if (imageUrlsRef.current.length === 0) {
//         toast.error('Please upload at least one image or video before submitting.')
//         return false
//       }
//       return true
//     }
//   }))

//   useEffect(() => {
//     if (imageUrls.length > 0) {
//       const existingCards = imageUrls.map(url => ({
//         preview: url,
//         type: url.match(/\.(jpeg|jpg|gif|png|webp|jfif)$/i) ? 'image' : 'video'
//       }))
//       setCards(existingCards)
//       setAllImageUrls(imageUrls)
//       imageUrlsRef.current = imageUrls
//     }
//   }, [imageUrls])

//   const onDrop = useCallback(
//     async acceptedFiles => {
//       setIsUploading(true) // Set uploading state to true
//       const newImageUrls = []
//       const newUploadingStatuses = [...uploadingStatuses]

//       const filePromises = acceptedFiles.map(async (file, index) => {
//         const url = URL.createObjectURL(file)
//         newUploadingStatuses[index] = true // Set uploading status for the current file
//         setUploadingStatuses([...newUploadingStatuses])

//         // Log the file type and size
//         console.log(`Uploading file: ${file.name}`)
//         console.log(`File type: ${file.type.includes('image') ? 'Image' : 'Video'}`)
//         console.log(`File size: ${(file.size / (1024 * 1024)).toFixed(2)} MB`)

//         if (file.size > MAX_VIDEO_SIZE_MB) {
//           toast.error('File size exceeds 500MB. Please upload a smaller video.')
//           newUploadingStatuses[index] = false // Reset uploading status for the current file
//           setUploadingStatuses([...newUploadingStatuses])
//           return
//         }

//         // Create an image element to check dimensions if it's an image
//         if (file.type.startsWith('image/')) {
//           const img = new Image()
//           img.onload = async () => {
//             const { width, height } = img

//             if (isValidImageSize(width, height)) {
//               const formData = new FormData()
//               formData.append('file', file)

//               try {
//                 const response = await fetch('/api/upload', {
//                   method: 'POST',
//                   body: formData
//                 })

//                 const data = await response.json()

//                 if (response.ok) {
//                   const { link } = data
//                   newImageUrls.push(link)

//                   setAllImageUrls(prevUrls => {
//                     const updatedUrls = [...prevUrls, link]
//                     imageUrlsRef.current = updatedUrls
//                     onUpload(updatedUrls) // Call the onUpload callback with the updated URLs
//                     return updatedUrls
//                   })

//                   setCards(prevCards => [
//                     ...prevCards,
//                     { preview: url, type: file.type.includes('video') ? 'video' : 'image' }
//                   ])
//                 } else {
//                   console.error('Failed to upload file:', data.message)
//                   toast.error(`Upload failed: ${data.message}`)
//                 }
//               } catch (error) {
//                 console.error('Error uploading file:', error)
//                 toast.error('Error uploading file.')
//               } finally {
//                 newUploadingStatuses[index] = false // Reset uploading status for the current file
//                 setUploadingStatuses([...newUploadingStatuses])
//               }
//             } else {
//               toast.error('Invalid image size. Please upload an image with dimensions 3840x2171.')
//               newUploadingStatuses[index] = false // Reset uploading status for the current file
//               setUploadingStatuses([...newUploadingStatuses])
//             }
//           }
//           img.src = URL.createObjectURL(file)
//         } else {
//           // Handle video uploads
//           const formData = new FormData()
//           formData.append('file', file)

//           try {
//             const response = await fetch('/api/upload', {
//               method: 'POST',
//               body: formData
//             })

//             const data = await response.json()

//             if (response.ok) {
//               const { link } = data
//               newImageUrls.push(link)

//               setAllImageUrls(prevUrls => {
//                 const updatedUrls = [...prevUrls, link]
//                 imageUrlsRef.current = updatedUrls
//                 onUpload(updatedUrls) // Call the onUpload callback with the updated URLs
//                 return updatedUrls
//               })

//               setCards(prevCards => [...prevCards, { preview: url, type: 'video' }])
//             } else {
//               console.error('Failed to upload file:', data.message)
//               toast.error(`Upload failed: ${data.message}`)
//             }
//           } catch (error) {
//             console.error('Error uploading file:', error)
//             toast.error('Error uploading file.')
//           } finally {
//             newUploadingStatuses[index] = false // Reset uploading status for the current file
//             setUploadingStatuses([...newUploadingStatuses])
//           }
//         }
//       })

//       await Promise.all(filePromises)
//       setIsUploading(false) // Stop the global loader after all files are processed
//     },
//     [onUpload, uploadingStatuses]
//   )

//   const handleDeleteCard = index => {
//     const updatedCards = cards.filter((_, i) => i !== index)
//     const updatedImageUrls = allImageUrls.filter((_, i) => i !== index)

//     setCards(updatedCards)
//     setAllImageUrls(updatedImageUrls)
//     imageUrlsRef.current = updatedImageUrls
//     onUpload(updatedImageUrls)
//   }

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     accept: 'image/*,video/*' // Accept both images and videos
//   })

//   return (
//     <div style={{ padding: '20px' }}>
//       <Grid container spacing={3}>
//         {cards.map((file, index) => (
//           <Grid item xs={12} sm={6} md={4} key={index}>
//             <BannnerCard
//               file={file}
//               onDelete={() => handleDeleteCard(index)}
//               onPreview={() => console.log('Preview image or video')}
//               isUploading={uploadingStatuses[index]} // Pass the correct uploading status
//             />
//           </Grid>
//         ))}
//         <Grid item xs={12} sm={6} md={4} className='min-h-[200px]'>
//           <Card
//             sx={{
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               border: '2px dotted #ddd', // Dotted border
//               borderRadius: '12px',
//               boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
//               cursor: isUploading ? 'not-allowed' : 'pointer',
//               position: 'relative',
//               minHeight: '200px',
//               minWidth: '150px',
//               overflow: 'hidden',
//               transition: 'background-color 0.3s ease',
//               padding: '16px' // Added padding for better layout
//             }}
//             {...getRootProps()}
//           >
//             <input {...getInputProps()} />
//             {isUploading ? (
//               <div
//                 style={{
//                   position: 'absolute',
//                   top: 0,
//                   left: 0,
//                   width: '100%',
//                   height: '100%',
//                   backgroundColor: 'rgba(255, 255, 255, 0.7)', // Semi-transparent overlay
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   zIndex: 1 // Ensure the overlay is on top
//                 }}
//               >
//                 <div className='modern-loader'></div>
//               </div>
//             ) : (
//               <>
//                 {isDragActive ? (
//                   <p style={{ color: '#4a90e2', fontSize: '16px' }}>Drop the files here ...</p>
//                 ) : (
//                   <p style={{ color: '#888', fontSize: '16px' }}>Drag & Upload</p>
//                 )}
//                 <IoAddCircleSharp style={{ fontSize: '36px', color: '#4a90e2' }} />
//               </>
//             )}
//           </Card>
//         </Grid>
//       </Grid>

//       {/* Add the loader CSS to the global styles */}
//       <style jsx global>{`
//         .modern-loader {
//           border: 8px solid rgba(0, 0, 0, 0.1);
//           border-radius: 50%;
//           border-top: 8px solid #4a90e2;
//           width: 60px;
//           height: 60px;
//           animation: spin 1.5s linear infinite;
//         }

//         @keyframes spin {
//           0% {
//             transform: rotate(0deg);
//           }
//           100% {
//             transform: rotate(360deg);
//           }
//         }
//       `}</style>
//     </div>
//   )
// })

// export default SliderWithBanner
