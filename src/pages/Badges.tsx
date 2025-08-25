import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { Link } from 'react-router-dom'

type BadgeRow = {
  id: string
  name: string
  icon_url?: string | null
  earned_at?: string
  course_title?: string
}

export default function Badges() {
  const [rows, setRows] = useState<BadgeRow[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        setErr(null)
        const data = await api('/me/badges')
        setRows(data)
      } catch (e: any) {
        setErr(e.message)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <div className="p-6 space-y-4">
      <Link to="/courses" className="text-blue-600 hover:underline">← Volver a cursos</Link>
      <h1 className="text-2xl font-bold">Mis Insignias</h1>

      {loading && <p>Cargando…</p>}
      {err && <p className="text-red-600">{err}</p>}

      {!loading && !err && (
        <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
          {rows.length === 0 && <p>Aún no tienes insignias.</p>}
          {rows.map(b => (
            <div key={b.id} className="border rounded-xl p-4 text-center">
              <div className="text-5xl">{b.icon_url ? '🏅' : '🎖️'}</div>
              <div className="font-semibold mt-2">{b.name}</div>
              {b.course_title && <div className="text-xs text-gray-600">Curso: {b.course_title}</div>}
              {b.earned_at && (
                <div className="text-xs text-gray-600">
                  {new Date(b.earned_at).toLocaleString()}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
