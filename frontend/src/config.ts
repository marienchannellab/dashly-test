export const STRAPI_URL = (
  import.meta.env.VITE_STRAPI_URL ?? 'http://localhost:1337'
).replace(/\/$/, '')

export const MEDIA_URL = (
  import.meta.env.VITE_MEDIA_URL ?? STRAPI_URL
).replace(/\/$/, '')
