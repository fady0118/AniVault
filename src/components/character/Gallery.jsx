import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useContext, useEffect, useRef, useState } from 'react'
import { RootContext } from '../../App'

const classes = {
  imageHoverAnimation:
    'hover:cursor-pointer hover:scale-105 hover:border-4 hover:border-amethyst-smoke-400/30 transition-transform duration-300',
  activeImage: 'border-3 border-blue-500/75',
  arrows:
    'absolute top-1/2 -translate-y-1/2 xs:static bg-amethyst-smoke-950/70 hover:bg-amethyst-smoke-950/50 xs:bg-transparent hover:cursor-pointer xs:hover:bg-amethyst-smoke-400/20 rounded-full p-1 box-content'
}

export default function Gallery ({
  pictures,
  name,
  activeIndex,
  closeGallery,
  onNext,
  onPrev,
  onOpen
}) {
  if (!pictures.length) return

  const { windowWidth } = useContext(RootContext)

  // arrow navigation
  function handleGalleryActions (e) {
    if (e.key === 'ArrowLeft') {
      onPrev()
    } else if (e.key === 'ArrowRight') {
      onNext()
    } else if (e.key === 'Escape') {
      closeGallery()
    }
  }

  useEffect(() => {
    document.documentElement.addEventListener('keydown', handleGalleryActions)
    return () =>
      document.documentElement.removeEventListener(
        'keydown',
        handleGalleryActions
      )
  }, [])

  // scroll into view
  useEffect(() => {
    if (activeIndex === null) return
    const galleryMapEl = document.getElementById('galleryMap')
    if (!galleryMapEl) return
    const galleryMapImages = Array.from(
      galleryMapEl.querySelectorAll('div.mini-img')
    )
    const imageNode = galleryMapImages.find(
      img => Number(img.dataset.index) === activeIndex
    )
    if (imageNode) {
      imageNode.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      })
    }
  }, [activeIndex])

  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })

  // reset zoom when switching images
  useEffect(() => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }, [activeIndex])

  const toggleZoom = () => {
    setZoom(z => (z === 1 ? 2.5 : 1))
    setPan({ x: 0, y: 0 })
  }

  const handlePointerDown = e => {
    if (zoom === 1) return
    e.preventDefault()
    e.target.setPointerCapture(e.pointerId)
    setDragging(true)
    dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y }
  }

  const handlePointerMove = e => {
    if (!dragging) return
    setPan({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    })
  }
  const handlePointerUp = () => setDragging(false)

  return (
    <div id='galleryModal' className='relative'>
      <div className='z-30 fixed top-1/2 left-1/2 transform -translate-1/2 w-full h-screen flex flex-col items-center justify-center gap-3 text-xs xs:text-sm lg:text-md'>
        {/* modal container */}
        <div className='z-50 relative flex flex-col gap-2 p-4 max-h-5/6 min-h-[50%] w-5/6 aspect-3/4 lg:w-4/5 lg:aspect-3/2 box-colors rounded-xl border border-amethyst-smoke-800/40 shadow-2xl'>
          {/* Header with title and image count */}
          <div className='w-full shrink-0 flex flex-col items-start justify-between p-1 pb-2 pr-5 border-b subtle-border-colors'>
            <div className='flex flex-wrap items-center gap-x-3 gap-y-1'>
              <p className='text-[0.75em] uppercase tracking-[0.24em] text-amethyst-smoke-950 dark:text-amethyst-smoke-500'>
                Gallery
              </p>
              <h2 className='text-[1.15em] font-semibold text-amethyst-smoke-950 dark:text-amethyst-smoke-100'>
                {name || 'Untitled'}
              </h2>
              <span className='text-[0.9em] text-amethyst-smoke-950/70 dark:text-amethyst-smoke-400'>
                {activeIndex + 1} / {pictures.length}
              </span>
            </div>
            <p className='text-[0.75em] text-amethyst-smoke-950 dark:text-amethyst-smoke-500'>
              Click the image to zoom, double-click it to zoom-out
            </p>

            <button
              type='button'
              onClick={closeGallery}
              className='absolute top-0 right-0 m-3 inline-flex items-center justify-center rounded-full border border-amethyst-smoke-700/30 dark:border-amethyst-smoke-400/30 text-amethyst-smoke-800 dark:text-amethyst-smoke-200 box-colors hover:cursor-pointer hover:bg-amethyst-smoke-700/40 dark:hover:bg-amethyst-smoke-800/65 duration-200'
              aria-label='Close gallery'
            >
              <X className='h-7.5 w-7.5 p-1.5 lg:h-10 lg:w-10 lg:p-2' />
            </button>
          </div>

          {/* Main image area with navigation arrows */}
          <div className='relative flex justify-evenly items-center flex-1 min-h-0 w-full py-2'>
            <ChevronLeft
              onClick={onPrev}
              className={`left-0 ${classes.arrows}`}
              size={windowWidth <= 480 ? 27 : 36}
            />
            <img
              key={activeIndex}
              draggable={false}
              onDragStart={e => e.preventDefault()}
              onClick={zoom === 1 ? toggleZoom : undefined}
              onDoubleClick={toggleZoom}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              style={{
                transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${
                  pan.y / zoom
                }px)`,
                transition: dragging ? 'none' : 'transform 200ms ease',
                cursor: zoom === 1 ? 'zoom-in' : dragging ? 'grabbing' : 'grab',
                userSelect: 'none',
                WebkitUserDrag: 'none'
              }}
              className='h-full w-auto aspect-auto object-cover rounded-lg gallery-image-animation shadow-md'
              src={
                pictures[activeIndex].jpg.large_image_url ||
                pictures[activeIndex].jpg.image_url
              }
              alt={`${name ?? 'unknown'}-picture`}
            />
            <ChevronRight
              onClick={onNext}
              className={`right-0 ${classes.arrows}`}
              size={windowWidth <= 480 ? 27 : 36}
            />
          </div>

          {/* Thumbnail strip — only on desktop */}
          {windowWidth >= 480 && (
            <div
              id='galleryMap'
              className='flex shrink-0 h-20 lg:h-24 gap-2 p-1 overflow-x-scroll scrollbar-thin scrollbar-thumb-amethyst-smoke-400/30'
            >
              {pictures.map((picture, i) => (
                <div
                  key={i}
                  data-index={i}
                  className={`mini-img aspect-square h-full rounded-sm overflow-clip 
            ${classes.imageHoverAnimation}
            ${activeIndex === i ? classes.activeImage : ''} `}
                  onClick={() => {
                    onOpen(i)
                  }}
                >
                  <img
                    className='h-full w-full object-cover pointer-events-none'
                    src={picture.jpg.image_url}
                    alt={`${name ?? 'unknown'}-picture`}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className='z-40 absolute top-0 left-0 scale-105 w-full h-full bg-dark-amethyst-smoke-100/60 backdrop-blur-md'></div>
      </div>
    </div>
  )
}
