function formatAniListDate (dateObj) {
  if (!dateObj ) return null
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const { year, month, day } = dateObj
  if(!year && !month && !day) return;
  const string = `${month?months[month-1]:""} ${day??""} ${year??""}`
    return string
}

function formatMediaEdges (edges) {
  if (!Array.isArray(edges)) return []
  return edges.map(edge => {
    const node = edge.node
    return {
      id: node.id,
      title: node.title?.english || node.title?.romaji || node.title?.native,
      coverImage: node.coverImage?.large || node.coverImage?.medium,
      type: node.type?.toLowerCase()
    }
  })
}

export function formatCharacterRoles (edges) {
  if (!Array.isArray(edges)) return []
  return edges.map(edge => {
    const characterNode = edge.node
    const media = (edge.media || []).map(m => ({
      id: m.id,
      mal_id: m?.idMal,
      title: m.title?.english || m.title?.romaji || m.title?.native,
      coverImage: m.coverImage?.large || m.coverImage?.medium,
      type: m.type?.toLowerCase()
    }))
    return {
      character: {
        id: characterNode.id,
        name: characterNode.name?.full,
        image: characterNode.image?.large || characterNode.image?.medium
      },
      role: edge.role,
      media
    }
  })
}

export function adaptPerson (data) {
  const staff = data?.Staff
  if (!staff) return {}

  const animeography = formatMediaEdges(staff.staffMedia.edges).filter(m => m.type === 'anime')
  const mangaography = formatMediaEdges(staff.staffMedia.edges).filter(m => m.type === 'manga')
  const voiceRoles = formatCharacterRoles(staff.characters?.edges)

  return {
    id: staff.id,
    name: staff.name,
    nativeName: staff.name?.native,
    image: staff.image,
    about: staff.description
      ? staff.description
          .replace(/~!([\s\S]+?)!~/g, '<span class="al-spoiler" tabindex="0">$1</span>')
      : 'No biography written.',
    gender: staff.gender,
    age: staff.age,
    birthday: formatAniListDate(staff.dateOfBirth),
    deathDate: formatAniListDate(staff.dateOfDeath),
    yearsActive: staff.yearsActive,
    homeTown: staff.homeTown,
    bloodType: staff.bloodType,
    occupations: staff.primaryOccupations || [],
    animeography,
    mangaography,
    voiceRoles,
    url: `https://anilist.co/staff/${staff.id}`
  }
}
