'use client'
import uploadEditorImage from '../../action/uploadFile'

export const processEditorContent = async content => {
  console.log('processEditorContent called@@@??')
  const parser = new DOMParser()
  const doc = parser.parseFromString(content, 'text/html')
  const images = doc.getElementsByTagName('img')

  for (let img of images) {
    const imgSrc = img.getAttribute('src')
    console.log('img.src', imgSrc)

    // Check if the image source is a base64 string
    if (imgSrc.startsWith('data:image')) {
      const uploadedUrl = await uploadEditorImage(imgSrc)
      if (uploadedUrl) {
        img.setAttribute('src', uploadedUrl)
      }
    }
    // If it's already a URL, we don't need to do anything
  }
  return new XMLSerializer().serializeToString(doc)
}

// 'use client'
// import uploadEditorImage from '../../action/uploadFile'

// export const processEditorContent = async content => {
//   console.log('processEditorContent called@@@??')
//   const parser = new DOMParser()
//   const doc = parser.parseFromString(content, 'text/html')
//   const images = doc.getElementsByTagName('img')

//   for (let img of images) {
//     const imgSrc = img.getAttribute('src')
//     console.log('img.src', imgSrc)

//     const uploadedUrl = await uploadEditorImage(imgSrc)
//     if (uploadedUrl) {
//       img.setAttribute('src', uploadedUrl)
//     }
//     // if (imgSrc && imgSrc.startsWith('data:')) {
//     //   // Convert base64 to Blob
//     //   const response = await fetch(imgSrc)
//     //   const blob = await response.blob()

//     //   // Convert Blob to base64 string
//     //   const reader = new FileReader()
//     //   const base64String = await new Promise(resolve => {
//     //     reader.onloadend = () => resolve(reader.result)
//     //     reader.readAsDataURL(blob)
//     //   })

//     //   // Upload the image to the cloud using the base64 string
//     // }
//   }

//   return new XMLSerializer().serializeToString(doc)
// }
