
import Schedual from './Schedual'
import { Link } from 'react-router'
import TrendingSection from './TrendingSection'

export default function HomeSidePanel () {

  return (
    //md:w-1/3 lg:w-1/4
    <div className='w-full min-w-0 h-fit grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-1 mt-3 gap-5 px-3'>
      <TrendingSection />
      <Schedual />
    </div>
  )
}
