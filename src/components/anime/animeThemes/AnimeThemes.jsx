import { Music4Icon } from 'lucide-react'
import AudioElement from './AudioElement'

export default function AnimeThemes ({ themes }) {
  console.log({ themes })
  return (
    <>
      <div>AnimeThemes</div>
      {themes?.openings.length || themes?.endings.length ? (
        <div
          id='theme'
          className='flex justify-center w-full h-fit text-2xs lg:text-[11px] order-6'
        >
          <div className='rounded-lg box-colors w-full grid grid-cols-1 sm:grid-cols-2 gap-x-2 py-1'>
            {themes.openings?.length ? (
              <div id='openings'>
                <div className='bottom-border pt-0.5 px-2 font-semibold text-md/relaxed capitalize'>
                  openings
                </div>
                <div className='flex flex-col w-full gap-y-1 px-2 py-1'>
                  {themes.openings?.map((opening, i) => (
                    <div
                      key={i}
                      className='w-full flex flex-row items-center justify-between gap-x-2 mt-1'
                    >
                      <div className='flex flex-row items-center gap-x-1'>
                        <Music4Icon className='min-w-2 w-2.5 aspect-square' />
                        <p className='font-medium text-[0.9em] xs:text-[1em] sm:text-[1.05em] md:text-[1.1em] lg:text-[1.15em]'>
                          {opening.audio.filename}
                        </p>
                      </div>
                      <AudioElement src={opening.audio.link} />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              ''
            )}
            {themes.endings?.length ? (
              <div id='endings'>
                <div className='bottom-border pt-0.5 px-2 font-semibold text-md/relaxed capitalize'>
                  endings
                </div>
                <div className='flex flex-col w-full gap-y-1 px-2 py-1'>
                  {themes.endings?.map((ending, i) => (
                    <div
                      key={i}
                      className='w-full flex flex-row items-center justify-between gap-x-2 mt-1'
                    >
                      <div className='flex flex-row items-center gap-x-1'>
                        <Music4Icon className='min-w-2 w-2.5 aspect-square' />
                        <p className='font-medium text-[0.9em] xs:text-[1em] sm:text-[1.05em] md:text-[1.1em] lg:text-[1.15em]'>
                          {ending.audio.filename}
                        </p>
                      </div>
                      <AudioElement src={ending.audio.link} />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
      ) : (
        ''
      )}
    </>
  )
}
