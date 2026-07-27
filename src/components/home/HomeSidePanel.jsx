
import Schedual from './Schedual'
import { Link } from 'react-router'
import TrendingSection from './TrendingSection'

export default function HomeSidePanel () {

  return (
    <div className='w-full md:w-1/3 lg:w-1/4 min-w-0 h-fit flex flex-col xs:flex-row md:flex-col mt-3 gap-4'>
      <TrendingSection />
      <Schedual />
    </div>
  )
}
