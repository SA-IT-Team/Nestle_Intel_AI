// In dev, Vite proxies /api → localhost:8000
// In production (Vercel), VITE_API_URL points to the Railway backend
const BASE = import.meta.env.VITE_API_URL || ''

export const API = {
  stream:  `${BASE}/api/research/stream`,
  insight: `${BASE}/api/research/insight`,
  health:  `${BASE}/api/health`,
}
