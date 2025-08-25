// src/lib/api.ts
import { createClient } from '@supabase/supabase-js'

// Client de Supabase (usa tus variables del .env)
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
)

const BASE = import.meta.env.VITE_API_URL // ej: http://localhost:4000

export async function api(path: string, init: RequestInit = {}) {
  // toma el token del usuario logueado
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token

  const headers = new Headers(init.headers)
  headers.set('Content-Type', 'application/json')
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const res = await fetch(`${BASE}${path}`, { ...init, headers })
  const text = await res.text()
  const json = text ? JSON.parse(text) : null

  if (!res.ok) {
    throw new Error(json?.message || `HTTP ${res.status}`)
  }
  return json
}
