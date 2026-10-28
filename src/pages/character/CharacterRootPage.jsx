// CharacterRootPage.jsx
import CharacterContainer from '../../components/character/CharacterContainer'
import BirthdayCharacters from '../../components/character/BirthdayCharacters'
import CharacterFilters from '../../components/character/CharacterFilters'

export default function CharacterRootPage () {
  return (
    <div className='relative left-1/2 -translate-x-1/2 z-10 w-full flex justify-center space-y-3 pt-15 pb-3 text-sm'>
      <div className='w-[95vw] flex flex-col'>
        <div
          id='title'
          className='order-1 mt-5 px-3 py-1 uppercase font-bold text-[1.6em]'
        >
          Browse Characters
        </div>
        <CharacterFilters/>
        <div className='order-3 grid grid-cols-1 lg:grid-cols-[3fr_1fr] xl:grid-cols-[4fr_1fr] gap-4 [grid-template-areas:"main""sidebar"] lg:[grid-template-areas:"main_sidebar"]'>
          <div className='[grid-area:main] min-w-0'>
            <CharacterContainer />
          </div>
          <aside className='[grid-area:sidebar] min-w-0'>
            <BirthdayCharacters />
          </aside>
        </div>
      </div>

      <div
        id='backgroundImage'
        className='-z-50 absolute top-0 left-0 w-screen h-full min-h-screen overflow-hidden'
      >
        <img
          src='/photo-bg.png'
          alt=''
          className='w-full h-full object-cover bg-no-repeat opacity-30 contrast-125'
        />
      </div>
    </div>
  )
}