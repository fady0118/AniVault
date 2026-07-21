import { Link } from 'react-router'
import { memo } from 'react'

function Box ({ dataObj, classes, image_class }) {
  const data = dataObj?.data
  if (!data) return null
  const { role, path, images, name, id } = data
  if (!images?.jpg?.image_url || !id || !name || !path) return null
  
  return (
    <div className='relative w-full'>
      <Link
        className='inline-block w-full box-border'
        to={`/${path}/${id}`}
      >
        <img
          className={image_class}
          style={{ height: '100%' }}
          src={images.jpg.image_url}
          alt={name}
          loading='lazy'
        />
        <div className={`${classes.responsive_text} ${classes.name_class}`}>
          {name}
        </div>
        {role && (
          <div className={`${classes.responsive_text} ${classes.role_class}`}>
            {role}
          </div>
        )}
      </Link>
    </div>
  )
}

export default memo(Box)
