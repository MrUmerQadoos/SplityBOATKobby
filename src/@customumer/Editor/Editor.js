import React, { Component } from 'react'
import ReactQuill, { Quill } from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import ImageResize from 'quill-image-resize-module-react'
import BlotFormatter from 'quill-blot-formatter'
// import { uploadEditorImage } from ''

// Register the modules with Quill
Quill.register('modules/imageResize', ImageResize)
Quill.register('modules/blotFormatter', BlotFormatter)

class Editor extends Component {
  constructor(props) {
    super(props)
    this.state = { editorHtml: '' }
    this.handleChange = this.handleChange.bind(this)
    this.imageHandler = this.imageHandler.bind(this)
    this.quillRef = null
    this.reactQuillRef = null
  }

  componentDidMount() {
    this.attachQuillRefs()
  }

  componentDidUpdate() {
    this.attachQuillRefs()
  }

  attachQuillRefs() {
    if (typeof this.reactQuillRef.getEditor !== 'function') return
    this.quillRef = this.reactQuillRef.getEditor()
  }

  imageHandler() {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.click()

    input.onchange = async () => {
      const file = input.files[0]
      const reader = new FileReader()

      reader.onload = e => {
        const base64 = e.target.result
        const range = this.quillRef.getSelection()
        this.quillRef.insertEmbed(range.index, 'image', base64)
      }

      reader.readAsDataURL(file)
    }
  }

  handleChange(html) {
    this.setState({ editorHtml: html })
    if (this.props.onChange) {
      this.props.onChange(html)
    }
  }

  render() {
    return (
      <ReactQuill
        ref={el => {
          this.reactQuillRef = el
        }}
        theme='snow'
        onChange={this.handleChange}
        value={this.state.editorHtml || this.props.value}
        modules={Editor.modules(this.imageHandler)}
        formats={Editor.formats}
        bounds={'#root'}
        placeholder={this.props.placeholder}
      />
    )
  }
}

// Quill modules to attach to editor
Editor.modules = imageHandler => ({
  toolbar: {
    container: [
      [{ header: '1' }, { header: '2' }, { font: [] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['link', 'image', 'video'],
      ['clean']
    ],
    handlers: {
      image: imageHandler
    }
  },
  clipboard: {
    matchVisual: false
  },
  imageResize: true,
  blotFormatter: {}
})

// Quill editor formats
Editor.formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'video'
]

export default Editor

// import { Component } from 'react'
// import ReactQuill, { Quill } from 'react-quill'
// import 'react-quill/dist/quill.snow.css'
// import ImageResize from 'quill-image-resize-module-react'
// import BlotFormatter from 'quill-blot-formatter'

// // Register the modules with Quill
// Quill.register('modules/imageResize', ImageResize)
// Quill.register('modules/blotFormatter', BlotFormatter)

// class Editor extends Component {
//   constructor(props) {
//     super(props)
//     this.state = { editorHtml: '' }
//     this.handleChange = this.handleChange.bind(this)
//   }

//   // handleChange(html) {
//   //   this.setState({ editorHtml: html })
//   //   console.log(html)
//   //   this.props.onChange(html) // Call the onChange function passed from props
//   // }
//   handleChange(html) {
//     this.setState({ editorHtml: html })
//     if (this.props.onChange) {
//       this.props.onChange(html) // Pass the HTML content back to the parent component
//     }
//   }

//   render() {
//     return (
//       <ReactQuill
//         theme='snow'
//         onChange={this.handleChange}
//         value={this.state.editorHtml || this.props.value} // Use state or props for value
//         modules={Editor.modules}
//         formats={Editor.formats}
//         bounds={'#root'}
//         placeholder={this.props.placeholder}
//       />
//     )
//   }
// }

// // Quill modules to attach to editor
// Editor.modules = {
//   toolbar: [
//     [{ header: '1' }, { header: '2' }, { font: [] }],
//     [{ size: [] }],
//     ['bold', 'italic', 'underline', 'strike', 'blockquote'],
//     [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
//     ['link', 'image', 'video'], // Add the image and video options here
//     ['clean']
//   ],
//   clipboard: {
//     matchVisual: false
//   },
//   imageResize: true, // Enable the image resize module
//   blotFormatter: {} // Enable the blot formatter module for image formatting
// }

// // Quill editor formats
// Editor.formats = [
//   'header',
//   'font',
//   'size',
//   'bold',
//   'italic',
//   'underline',
//   'strike',
//   'blockquote',
//   'list',
//   'bullet',
//   'indent',
//   'link',
//   'image',
//   'video' // Allow videos
// ]

// export default Editor
