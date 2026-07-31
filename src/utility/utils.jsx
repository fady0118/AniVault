import { LinkIcon } from 'lucide-react'
import { Link } from 'react-router'
import DOMPurify from 'isomorphic-dompurify'
import { marked } from 'marked'

// theme detecting and toggling function
export function themeToggler () {
  // get local & os theme value
  const localTheme = localStorage.getItem('theme')
  const prefersDarkMode = window.matchMedia(
    '(prefers-color-scheme: dark)'
  ).matches
  // modify the html theme class
  if (
    localTheme === 'dark' ||
    (!('theme' in localStorage) && prefersDarkMode)
  ) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

export function getCurrentTheme () {
  // return localStorage.getItem("theme");
  const localTheme = localStorage.getItem('theme')
  switch (localTheme) {
    case 'dark':
      return 'dark'
    case 'light':
      return 'light'
    default:
      return 'os'
  }
}

// helper function for getting the season from a date string
export function getSeason (d) {
  const date = new Date(d)
  const currentDate = date.toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric'
  })
  const [month, day] = currentDate.split('/').map(i => Number(i))
  if (
    (month === 3 && day >= 21) ||
    month === 4 ||
    month === 5 ||
    (month === 6 && day < 21)
  ) {
    return 'Spring'
  }
  if (
    (month === 6 && day >= 21) ||
    month === 7 ||
    month === 8 ||
    (month === 9 && day < 21)
  ) {
    return 'Summer'
  }
  if (
    (month === 9 && day >= 21) ||
    month === 10 ||
    month === 11 ||
    (month === 12 && day < 21)
  ) {
    return 'Fall'
  }
  return 'Winter'
}
// helper function for getting the season from a date string
export function getYear (d) {
  const date = new Date(d)
  const currentDate = date.toLocaleDateString('en-US', { year: 'numeric' })
  return currentDate
}

// render function for information section for string data
export function renderInfoStr (title, str, link = null) {
  return (
    <div className='w-full flex flex-row flex-wrap gap-x-1 items-end capitalize'>
      <p className='font-semibold '>{title}:</p>
      {link ? (
        <Link to={link} className='text-[0.9em] blue-link'>
          {str.trim() || '?'}
        </Link>
      ) : (
        <p className='text-[0.9em]'>{str.trim() || '?'}</p>
      )}
    </div>
  )
}

// render function for information section for array data
export function renderInfoArr (title, arr, path = null) {
  if (!arr?.length) return
  return (
    <div className='w-full flex flex-row gap-x-1 items-start capitalize'>
      <p className='font-semibold '>{title}:</p>
      <div className='flex flex-row flex-wrap'>
        {arr.length
          ? arr.map((item, i, arr) => (
              <div key={i}>
                {!path ? (
                  <p className='whitespace-pre-wrap'>
                    {item?.name}
                    {i !== arr.length - 1 ? ', ' : ''}
                  </p>
                ) : (
                  <Link
                    className='blue-link whitespace-pre-wrap'
                    to={`${path}${
                      item?.id ?? item?.name?.replace(/\+/g, '%2B')
                    }`}
                  >
                    {item?.name}
                    {i !== arr.length - 1 ? ', ' : ''}
                  </Link>
                )}
              </div>
            ))
          : 'None found.'}
      </div>
    </div>
  )
}

// render function for the external links section that returns an icon imgs for the links data
export function renderIcon (name) {
  if (name.toLowerCase().includes('wikipedia')) {
    return (
      <img
        className='h-3.5 w-3.5 object-contain'
        alt='Wikipedia icon'
        src='https://cdn.myanimelist.net/img/common/external_links/202.png'
      />
    )
  }
  switch (name) {
    case 'Twitter':
      return (
        <img
          className='h-3.5 w-3.5 object-contain'
          alt='twitter icon'
          src='https://cdn.myanimelist.net/img/common/external_links/101.png'
        />
      )
    case 'YouTube':
      return (
        <img
          alt='YouTube icon'
          className='h-3.5 w-3.5 object-contain'
          src='https://cdn.myanimelist.net/img/common/external_links/102.png'
        />
      )
    case 'Facebook':
      return (
        <img
          alt='YouTube icon'
          className='h-3.5 w-3.5 object-contain'
          src='https://upload.wikimedia.org/wikipedia/commons/b/b9/2023_Facebook_icon.svg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original'
        />
      )
    case 'AniDB':
      return (
        <img
          className='h-3.5 w-3.5 object-contain'
          alt='AniDB icon'
          src='https://cdn.myanimelist.net/img/common/external_links/200.png'
        />
      )
    case 'TikTok':
      return (
        <img
          className='h-3.5 w-3.5 object-contain'
          alt='TikTok icon'
          src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOW2E8-w-ydD3F1kcM398-zLztBQitShBV0bsDzjplBg&s=10'
        />
      )
    case 'ANN':
      return (
        <img
          className='h-3.5 w-3.5 object-contain'
          alt='ANN icon'
          src='https://cdn.myanimelist.net/img/common/external_links/201.png'
        />
      )
    case 'Syoboi':
      return (
        <img
          className='h-3.5 w-3.5 object-contain'
          alt='Syoboi icon'
          src='https://cdn.myanimelist.net/img/common/external_links/203.png'
        />
      )
    case 'Netflix':
      return (
        <img
          className='h-3.5 w-3.5 object-contain'
          alt='Crunchyroll icon'
          src='https://upload.wikimedia.org/wikipedia/commons/7/75/Netflix_icon.svg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original'
        />
      )
    case 'Crunchyroll':
      return (
        <img
          className='h-3.5 w-3.5 object-contain'
          alt='Crunchyroll icon'
          src='https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/crunchyroll.png'
        />
      )
    case 'Hulu':
      return (
        <img
          className='h-3.5 w-3.5 object-contain'
          alt='Hulu icon'
          src='https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/hulu.png'
        />
      )
    case 'Bilibili':
      return (
        <img
          className='h-3.5 w-3.5 object-contain'
          alt='Hulu icon'
          src='https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/bilibili.png'
        />
      )
    case 'Bilibili TV':
      return (
        <img
          className='h-3.5 w-3.5 object-contain'
          alt='Hulu icon'
          src='https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/bilibili.png'
        />
      )
    case 'Hoopla':
      return (
        <img
          className='h-3.5 w-3.5 object-contain'
          alt='Hulu icon'
          src='https://www.richlandlibrary.org/borrow/ebooks-digital-content/hoopla-icon.png/@@images/image.png'
        />
      )
    case 'Amazon Prime Video':
      return (
        <img
          className='h-3.5 w-3.5 object-contain'
          alt='Hulu icon'
          src='https://cdn.jsdelivr.net/gh/selfhst/icons/png/amazon-prime-video.png'
        />
      )
    case 'Disney Plus':
      return (
        <img
          className='h-3.5 w-3.5 object-contain'
          alt='Hulu icon'
          src='https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/disney-plus.png'
        />
      )
    case 'Instagram':
      return (
        <img
          className='h-3.5 w-3.5 object-contain'
          alt='Hulu icon'
          src='https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/instagram.png'
        />
      )
    default:
      return <LinkIcon size={12} />
  }
}

// takes a date string and returns it in a more readable format
export function dateFormatter (date) {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
export function DateTimeFormatter (date) {
  const d = new Date(date)
  return `${d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })} ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
}

// simple delay function useful for delaying api calls to avoid running into rate limit rejections
export const delay = ms => new Promise(res => setTimeout(res, ms))

// render function for the review section that returns an emoji representation for the reactions data
export function renderReactions (reactions) {
  const reactionsArr = {
    nice: '😊',
    love_it: '😍',
    funny: '😂',
    confusing: '🤔',
    informative: '💡',
    well_written: '🧠',
    creative: '🎨'
  }
  const rects = Object.entries(reactions)
    .filter(r => r[0] !== 'overall')
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
  return (
    <div className='flex flex-col xs:flex-row flex-wrap gap-0.5'>
      {rects.map((r, i) =>
        r[1] > 0 ? (
          <div
            key={i}
            className='flex flex-row items-center gap-x-0.5 px-0.5 rounded-sm border border-blue-800/50 dark:border-blue-400/50'
          >
            <span>{reactionsArr[r[0]]}</span>
            <span>{((100 * r[1]) / reactions.overall).toFixed(2)}%</span>
          </div>
        ) : (
          ''
        )
      )}
    </div>
  )
}

// get thumnail from yt embed-url
export function getYouTubeThumbnail (embedUrl, quality = 'hqdefault') {
  const match = embedUrl.match(/embed\/([^?&/]+)/)
  if (!match) {
    return null
  }
  const videoId = match[1]
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`
}

// get thumbnail & embedUrl from yt videoId
export function getYouTubeUrls (videoId, quality = 'hqdefault') {
  if (!videoId) return
  return {
    thumbnail: `https://img.youtube.com/vi/${videoId}/${quality}.jpg`,
    embedUrl: `https://www.youtube.com/embed/${videoId}`
  }
}

export function getCurrentSeason () {
  const date = new Date()
  const year = date.getFullYear()
  const currentDate = date.toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric'
  })
  const [month, day] = currentDate.split('/').map(i => Number(i))
  if (
    (month === 3 && day >= 21) ||
    month === 4 ||
    month === 5 ||
    (month === 6 && day < 21)
  ) {
    return { season: 'Spring', year }
  }
  if (
    (month === 6 && day >= 21) ||
    month === 7 ||
    month === 8 ||
    (month === 9 && day < 21)
  ) {
    return { season: 'Summer', year }
  }
  if (
    (month === 9 && day >= 21) ||
    month === 10 ||
    month === 11 ||
    (month === 12 && day < 21)
  ) {
    return { season: 'Fall', year }
  }
  return { season: 'Winter', year }
}

export function formatDate ({ year, month, day } = {}) {
  if (!year) return null
  if (!month) return `${year}`
  const monthName = new Date(
    Date.UTC(year, month - 1, day || 1)
  ).toLocaleString('en-US', {
    month: 'short'
  })
  return day ? `${monthName} ${day}, ${year}` : `${monthName} ${year}`
}

export const type_status_map = {
  type: {
    ANIME: {
      TV: 'TV',
      'TV short': 'TV_SHORT',
      Movie: 'MOVIE',
      Special: 'SPECIAL',
      OVA: 'OVA',
      ONA: 'ONA',
      Music: 'MUSIC'
    },
    MANGA: {
      Manga: 'MANGA',
      Novel: 'NOVEL',
      'One Shot': 'ONE_SHOT'
    }
  },
  status: {
    ANIME: {
      FINISHED: 'Finished airing',
      RELEASING: 'Currently airing',
      NOT_YET_RELEASED: 'Not yet aired',
      CANCELLED: 'Cancelled',
      HIATUS: 'On hiatus'
    },
    MANGA: {
      FINISHED: 'Finished publishing',
      RELEASING: 'Currently publishing',
      NOT_YET_RELEASED: 'Not yet published',
      CANCELLED: 'Cancelled',
      HIATUS: 'On hiatus'
    }
  }
}

export function domPurifyParseMarkDown (text) {
  const dirtyString = marked.parse(text)
  const clean = DOMPurify.sanitize(dirtyString, { ADD_ATTR: ['target'] })
  return clean
}

export function adaptText (raw) {
  if (!raw) return ''

  const combinedRegex =
    /img(\d+)\((https?:\/\/\S+?)\)(?=\s|$)|(https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*))/gi

  let autoIndex = 0 // Fallback index for bare URLs without a number

  const htmlString = raw.replace(
    combinedRegex,
    (match, imgNum, imgUrl, bareUrl) => {
      // If imgNum and imgUrl are defined, Branch 1 matched. Otherwise, Branch 2 matched.
      const url = imgUrl || bareUrl

      // Use the explicit number from Img123() if it exists, otherwise increment the fallback index
      const index = imgNum !== undefined ? imgNum : autoIndex++

      try {
        new URL(url)
      } catch {
        return match // If URL parsing fails, return the raw text untouched
      }

      return `<a href="${url}" class="indigo-link" target="_blank" rel="noopener noreferrer" data-img-index="${index}">${url}</a>`
    }
  )
  return (
    htmlString
      // line breaks -> actual newlines
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>\s*<p>/gi, '\n\n')
      .replace(/<\/?p>/gi, '')

      // common inline tags -> markdown equivalents
      .replace(/<(strong|b)>(.*?)<\/\1>/gi, '**$2**')
      .replace(/<(em|i)>(.*?)<\/\1>/gi, '*$2*')

      // non-breaking space / common entities

      .replace(/&nbsp;/gi, ' ')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/&amp;/gi, '&') // must be last

      // collapse leftover whitespace runs from replaced tags
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  )
}
