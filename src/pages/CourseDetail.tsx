// src/components/courses/CourseDetail.tsx
import { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../lib/api'

type Course = {
  id: string
  title: string
  description?: string
  module: 'fullstack' | 'apis' | 'cloud' | 'data'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration_hours: number
  instructor?: string
  thumbnail_url?: string
}

type Chapter = {
  id: string
  title: string
  description?: string
  content_url?: string
  content_type?: string
  duration_minutes: number
  order_index: number
  is_required: boolean
}

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>()
  const courseId = id!

  const [course, setCourse] = useState<Course | null>(null)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null)
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)

  const total = chapters.length
  const completed = completedIds.size
  const progressPercent = useMemo(
    () => (total ? Math.round((completed / total) * 100) : 0),
    [completed, total]
  )

  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        setErr(null)
        const c: Course = await api(`/courses/${courseId}`)
        setCourse(c)
        const ch: Chapter[] = await api(`/courses/${courseId}/chapters`)
        ch.sort((a, b) => a.order_index - b.order_index)
        setChapters(ch)
        // selecciona primer capítulo por defecto (si existe)
        if (ch.length) setSelectedChapter(ch[0])
      } catch (e: any) {
        setErr(e.message)
      } finally {
        setLoading(false)
      }
    })()
  }, [courseId])

  async function handleComplete() {
    if (!selectedChapter?.id) {
      alert('No hay capítulo seleccionado')
      return
    }
    try {
      const res = await api(`/progress/${courseId}/complete/${selectedChapter.id}`, {
        method: 'POST'
      })
      setCompletedIds(prev => new Set(prev).add(selectedChapter.id))
      if (res?.progressPercent >= 100) {
        alert('🎉 ¡Curso completado! Se generó tu insignia.')
      }
    } catch (e: any) {
      console.error('complete error', e)
      alert(`Error al marcar capítulo: ${e.message}`)
    }
  }

  if (loading) return <div className="p-6">Cargando…</div>
  if (err) return <div className="p-6 text-red-600">{err}</div>
  if (!course) return <div className="p-6">Curso no encontrado</div>

  return (
    <div className="p-6 space-y-4">
      <Link to="/courses" className="text-blue-600 hover:underline">← Volver a cursos</Link>

      {/* Header */}
      <div className="rounded-xl border p-4">
        <h2 className="text-xl font-semibold">{course.title}</h2>
        <p className="text-gray-600">{course.description}</p>

        <div className="mt-3 h-2 bg-gray-200 rounded">
          <div
            className="h-2 rounded bg-gradient-to-r from-purple-700 to-purple-500 transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <small className="text-gray-600">
          {completed} de {total} capítulos completados — {progressPercent}%
        </small>
      </div>

      {/* Lista capítulos + selección */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border p-4">
          <h3 className="font-semibold mb-3">Contenido del curso</h3>
          {chapters.length === 0 && (
            <p className="text-gray-600">Este curso aún no tiene capítulos.</p>
          )}
          <ul className="space-y-2">
            {chapters.map(ch => {
              const done = completedIds.has(ch.id)
              const selected = selectedChapter?.id === ch.id
              return (
                <li
                  key={ch.id}
                  className={`border rounded-lg p-3 cursor-pointer ${selected ? 'ring-2 ring-purple-500' : ''}`}
                  onClick={() => setSelectedChapter(ch)}
                >
                  <div className="font-medium">
                    {ch.order_index}. {ch.title} {done ? '✅' : ''}
                  </div>
                  <small className="text-gray-600">
                    {ch.content_type ?? 'contenido'} · {ch.duration_minutes ?? 0} min
                  </small>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Panel capítulo seleccionado */}
        <div className="rounded-xl border p-4">
          <h3 className="font-semibold mb-3">Capítulo seleccionado</h3>
          {!selectedChapter && <p className="text-gray-600">Selecciona un capítulo para comenzar.</p>}
          {selectedChapter && (
            <>
              <div className="mb-3">
                <div className="text-lg font-medium">{selectedChapter.title}</div>
                <small className="text-gray-600">
                  {selectedChapter.content_type ?? 'contenido'} · {selectedChapter.duration_minutes ?? 0} min
                </small>
              </div>

              {/* Muestra el botón solo si hay capítulo */}
              <button
                onClick={handleComplete}
                disabled={completedIds.has(selectedChapter.id)}
                className={`px-4 py-2 rounded text-white ${
                  completedIds.has(selectedChapter.id)
                    ? 'bg-gray-400'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {completedIds.has(selectedChapter.id) ? 'Completado' : 'Marcar como completado'}
              </button>

              <div className="mt-4">
                <Link to="/badges" className="text-blue-600 hover:underline">Ver mis insignias →</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
