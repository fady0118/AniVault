import { useContext, useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX, PauseIcon, PlayIcon } from 'lucide-react'
import { RootContext } from '../../../App.jsx'

function formatTime (t) {
  if (!isFinite(t)) return '0:00'
  const m = Math.floor(t / 60)
  const s = Math.floor(t % 60)
    .toString()
    .padStart(2, '0')
  return `${m}:${s}`
}

export default function AudioElement ({ src }) {
  const { windowWidth } = useContext(RootContext)
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [current, setCurrent] = useState(0)
  const [muted, setMuted] = useState(false)
  const [dragging, setDragging] = useState(false)
  const isSmallScreen = windowWidth <= 640

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onLoaded = () => setDuration(audio.duration || 0)
    const onTime = () => {
      if (!dragging) setCurrent(audio.currentTime)
    }
    const onEnd = () => setPlaying(false)

    audio.addEventListener('loadedmetadata', onLoaded)
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('ended', onEnd)
    return () => {
      audio.removeEventListener('loadedmetadata', onLoaded)
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('ended', onEnd)
    }
  }, [dragging])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
    } else {
      audio.play()
    }
    setPlaying(!playing)
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.muted = !muted
    setMuted(!muted)
  }

  const onSeek = e => {
    const value = Number(e.target.value)
    setCurrent(value)
    if (audioRef.current) audioRef.current.currentTime = value
  }

  const progressPct = duration ? (current / duration) * 100 : 0

  const colors = {
    text: 'text-amethyst-smoke-950/75 dark:text-amethyst-smoke-300/75',
    iconButton:
      'text-amethyst-smoke-900/75 hover:text-amethyst-smoke-900 dark:text-amethyst-smoke-300/75 dark:hover:text-amethyst-smoke-300 cursor-pointer duration-200',
    trackBg: 'bg-amethyst-smoke-800/40',
    trackFill: 'bg-amethyst-smoke-800 dark:bg-amethyst-smoke-200',
    thumb: 'bg-amethyst-smoke-800 dark:bg-amethyst-smoke-200',
    thumbBorder:
      'border-1 border-amethyst-smoke-800 dark:border-amethyst-smoke-200'
  }

  return (
    <div
      className={`scale-115 rounded-xl bg-amethyst-smoke-300/30 dark:bg-dark-amethyst-smoke-200/90 py-1 px-1 mx-1.5 shadow-sm text-[1em] sm:text-[1.05em] md:text-[1.1em] lg:text-[1.125em] xl:text-[1.15em] ${colors.text}`}
    >
      <audio ref={audioRef} src={src} preload='metadata' />
      {isSmallScreen ? (
        <div className='flex items-center justify-between gap-2 px-1'>
          <button
            onClick={togglePlay}
            className='flex items-center justify-center rounded-md p-0.5'
          >
            {playing ? (
              <PauseIcon
                className={`h-3 w-3 stroke-0 ${colors.iconButton}`}
                fill='currentColor'
              />
            ) : (
              <PlayIcon
                className={`h-3 w-3 stroke-0 ${colors.iconButton}`}
                fill='currentColor'
              />
            )}
          </button>
          <div className='flex items-center gap-1 text-[0.9em] sm:text-[1em]'>
            <span>{formatTime(current)}</span>/
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      ) : (
        <div className='flex items-center gap-1 lg:gap-2'>
          <button onClick={togglePlay}>
            {playing ? (
              <PauseIcon
                className={`h-3 w-3 sm:h-3.25 sm:w-3.25 lg:h-3.5 lg:w-3.5 xl:h-3.75 xl:w-4 stroke-0 ${colors.iconButton}`}
                fill='currentColor'
              />
            ) : (
              <PlayIcon
                className={`h-3 w-3 sm:h-3.25 sm:w-3.25 lg:h-3.5 lg:w-3.5 xl:h-3.75 xl:w-4 stroke-0 translate-x-px ${colors.iconButton}`}
                fill='currentColor'
              />
            )}
          </button>
          <div className='min-w-10 grow h-full px-1 lg:px-2'>
            <div className='group relative flex items-center'>
              <div
                className={`absolute h-0.5 w-full rounded-full ${colors.trackBg}`}
              />
              <div
                className={`absolute h-0.5 rounded-full ${colors.trackFill}`}
                style={{ width: `${progressPct}%` }}
              />
              <div
                className={`absolute h-1.5 w-1.5 lg:h-2 lg:w-2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full box-border group-hover:border-amethyst-smoke-500 transition-colors duration-100 ${colors.thumb} ${colors.thumbBorder}`}
                style={{ left: `${progressPct}%` }}
              />
              <input
                type='range'
                min={0}
                max={duration || 0}
                step={0.01}
                value={current}
                onChange={onSeek}
                onMouseDown={() => setDragging(true)}
                onMouseUp={() => setDragging(false)}
                className='absolute w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-transparent [&::-webkit-slider-thumb]:border-0 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-transparent [&::-moz-range-thumb]:border-0 lg:[&::-webkit-slider-thumb]:h-3.5 lg:[&::-webkit-slider-thumb]:w-3.5 lg:[&::-moz-range-thumb]:h-3.5 lg:[&::-moz-range-thumb]:w-3.5'
                aria-label='Seek'
              />
            </div>
          </div>
          <div
            className={`min-w-18 flex justify-center items-center gap-x-0.5 text-[0.75em] sm:text-[0.8em] md:text-[0.85em] lg:text-[0.9em] xl:text-[0.95em]`}
          >
            <span>{formatTime(current)}</span>/
            <span>{formatTime(duration)}</span>
          </div>

          <button
            onClick={toggleMute}
            aria-label={muted ? 'Unmute' : 'Mute'}
            className={`w-fit px-px transition-colors ${colors.iconButton}`}
          >
            {muted ? (
              <VolumeX className='h-3.25 md:w-3.25 lg:h-3.5 lg:w-3.5 xl:h-3.75 xl:w-4' />
            ) : (
              <Volume2 className='h-3.25 md:w-3.25 lg:h-3.5 lg:w-3.5 xl:h-3.75 xl:w-4' />
            )}
          </button>
        </div>
      )}
    </div>
  )
}
