export function getFriendlyErrorMessage (error) {
  const status = error?.status

  if (status === 404) return 'This item does not exist.'
  if (status === 500) return 'Server error, please try again later.'
  if (status === 400) return 'Invalid request.'

  return error?.message || 'Failed to load.'
}
