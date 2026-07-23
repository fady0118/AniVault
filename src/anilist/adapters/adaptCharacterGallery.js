export function adaptCharacterGallery (data) {
  if (!Array.isArray(data)) return []
  return data.map(item => ({
    jpg: {
      large_image_url: item.file_url,
      image_url: item.sample_url || item.preview_url
    }
  }))
}
