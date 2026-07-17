// Update `url` for each platform with Lebeza's real profile links.
export const SOCIAL_PROFILES = [
  { label: 'Facebook', url: 'https://facebook.com' },
  { label: 'Instagram', url: 'https://instagram.com' },
  { label: 'Telegram', url: 'https://telegram.org' },
  { label: 'YouTube', url: 'https://youtube.com' },
]

// Drop in real YouTube video IDs here (the part after "v=" in a YouTube URL,
// e.g. for youtube.com/watch?v=ABC123 the id is "ABC123") and they will
// render as embedded players at the end of the Blog page. Leave this array
// empty and the section will show a friendly "no videos yet" placeholder.
export const YOUTUBE_VIDEOS = [
  // { id: 'ABC123xyz', title: 'Inside Lebeza Psychiatry Clinic' },
]

export default { SOCIAL_PROFILES, YOUTUBE_VIDEOS }
