import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../Contexts/AuthContext'
import { ID } from 'appwrite'
import { storage, tablesDB } from '../../appwrite'
import LoaderComponent from '../LoaderComponent'
import ReactCrop, { cropToCanvas, cropToImg } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

export default function AvatarModal ({ avatarImg, setShowAvatarModal }) {
  const [src, setSrc] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [status, setStatus] = useState('idle') // idle, uploading, success, error
  const [error, setError] = useState(null)
  const { loggedInUser, setAvatarImg } = useAuth()

  const [crop, setCrop] = useState({
    unit: '%', // Can be 'px' or '%'
    x: 17.5,
    y: 17.5,
    width: 65,
    height: 65,
    aspect: 1
  })
  const [completedCrop, setCompletedCrop] = useState(null)
  const [previewSrc, setPreviewSrc] = useState(null)
  const imgRef = useRef(null)

  async function updatePreview (crop) {
    if (!imgRef.current) {
      return
    }
    setPreviewSrc(await cropToImg(imgRef.current, crop))
  }

  // modal close eventListener
  useEffect(() => {
    function handleKeyDown (e) {
      if (e.key === 'Escape') {
        setShowAvatarModal(false)
      }
    }
    document.documentElement.addEventListener('keydown', handleKeyDown)
    return () =>
      document.documentElement.removeEventListener('keydown', handleKeyDown)
  }, [])

  // update file state
  function handleFileChange (e) {
    const file = e.target?.files?.[0]
    if (!file) return

    let error = null
    if (!file.type.startsWith('image/')) {
      error = 'Not an image'
    } else if (file.size / 1024 > 500) {
      error = 'Max size is 500kb'
    }

    if (error) {
      setError(error)
      setSelectedFile(null)
      setSrc(null)
      return
    }

    setError(null)
    setSelectedFile(file)

    const reader = new FileReader()
    reader.addEventListener('load', () => {
      const image_url = reader.result?.toString() || ''
      setSrc(image_url)
    })
    reader.readAsDataURL(file)
  }

  async function getCroppedBlob (croppedImg) {
    if (
      !imgRef.current ||
      !selectedFile ||
      !croppedImg?.width ||
      !croppedImg?.height
    )
      return null

    const canvas = document.createElement('canvas')
    await cropToCanvas(imgRef.current, canvas, croppedImg)

    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (!blob) {
          reject(new Error('Failed to create cropped image blob'))
          return
        }

        const croppedFile = new File([blob], selectedFile.name, {
          type: selectedFile.type
        })
        const formData = new FormData()
        formData.append('file', croppedFile)
        resolve(formData)
      }, selectedFile.type)
    })
  }

  // upload to backend
  async function fileUploader () {
    const formData = await getCroppedBlob(completedCrop)
    if (!formData) {
      setError('Unable to crop image')
      return
    }

    setStatus('uploading')
    const uploadFile = formData.get('file')
    const fileId = ID.unique()
    try {
      const uploaded = await storage.createFile({
        bucketId: import.meta.env.VITE_APPWRITE_BUCKET_ID,
        fileId: fileId,
        file: uploadFile
      })

      const user = await tablesDB.updateRow(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_TABLE_ID_USER_PROFILE,
        loggedInUser.$id,
        { avatarId: fileId }
      )
      // instead of fetching the image from the storage we just set its state locally (more efficient)
      if (uploadFile instanceof File) {
        setAvatarImg(URL.createObjectURL(uploadFile))
      }
      setShowAvatarModal(false)
    } catch (e) {
      setError(e.message)
    } finally {
      setStatus('idle')
    }
  }

  return (
    <div className='fixed inset-0 z-30 flex items-center justify-center p-4 box-colors-lighter text-[0.75em] backdrop-blur-sm'>
      <div className='relative z-40 w-full max-w-lg rounded-xl box-colors-medium border border-base-200/60'>
        <div className='w-full py-1 px-3 flex flex-row items-center justify-between border-b border-dark-amethyst-smoke-50/20 dark:border-amethyst-smoke-50/20'>
          <p className='font-extrabold capitalize text-[1.25em]'>Edit Avatar</p>
          <button
            onClick={() => setShowAvatarModal(false)}
            className='btn btn-ghost btn-sm btn-circle bg-transparent stroke-text-light'
            aria-label='Close avatar modal'
          >
            ✕
          </button>
        </div>

        <div className='w-full flex flex-col sm:flex-row gap-3 p-3'>
          <div className='w-full  flex flex-col gap-y-1.5'>
            <p>Maximum file size is 500 kb.</p>
            <input
              type='file'
              name='avatar-upload'
              id='avatar-upload'
              accept='image/*'
              onChange={handleFileChange}
              className='w-fit overflow-clip p-1 rounded-sm border border-dark-amethyst-smoke-50/20 dark:border-amethyst-smoke-50/20'
            />
            {src && (
              <>
                {error && (
                  <div
                    role='alert'
                    className='text-rose-600 dark:text-rose-400 bg-rose-600/5 rounded-sm px-1 py-0.5 text-[1em]'
                  >
                    <span>{error}</span>
                  </div>
                )}

                {status !== 'uploading' && !error && (
                  <>
                    <div>
                      <ReactCrop
                        crop={crop}
                        onChange={(_, percentCrop) => setCrop(percentCrop)}
                        onComplete={c => {
                          setCompletedCrop(c)
                          void updatePreview(c)
                        }}
                      >
                        <img ref={imgRef} alt='Crop me' src={src} />
                      </ReactCrop>
                    </div>
                    <button
                      onClick={fileUploader}
                      className='btn btn-primary w-fit'
                    >
                      upload
                    </button>
                  </>
                )}
                {status === 'uploading' && (
                  <div className='scale-75 py-2'>
                    <LoaderComponent />
                  </div>
                )}
              </>
            )}

            <p className='text-[0.85em] font-light text-text-light/70 dark:text-text-dark/70'>
              AniVault automatically displays a default avatar, or you can add a
              custom avatar instead.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
