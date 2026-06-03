// Strip trailing slash to avoid //api double-slash bug
const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

export const API = {
  stream:  `${BASE}/api/research/stream`,
  insight: `${BASE}/api/research/insight`,
  health:  `${BASE}/api/health`,
}
