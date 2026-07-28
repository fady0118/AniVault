
import Schedual from './Schedual'
import { Link } from 'react-router'
import TrendingSection from './TrendingSection'

export default function HomeSidePanel () {

  return (
    <div className='w-full md:w-1/3 lg:w-1/4 min-w-0 h-fit grid grid-cols-1 xs:grid-cols-2 md:grid-cols-1 mt-3 gap-5 md:px-5'>
      <TrendingSection />
      <Schedual />
    </div>
  )
}
