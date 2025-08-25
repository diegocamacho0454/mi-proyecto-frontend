import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, Users, Award, Play, CheckCircle, Lock } from 'lucide-react'
import { db } from '../../lib/supabase'
import { useAuthContext } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

interface Chapter {
  id: string
  title: string
  content_url: string
  content_type: 'video' | 'document' | 'presentation'
  order_index: number
  duration_minutes: number
}

interface Course {
  id: string
  title: string
  description: string
  module: string
  duration_hours: number
  difficulty: string
  instructor: string
  thumbnail_url?: string
  course_chapters: Chapter[]
}

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuthContext()
  const [course, setCourse] = useState<Course | null>(null)
  const [progress, setProgress] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null)

  useEffect(() => {
    if (id) {
      loadCourse()
      loadProgress()
    }
  }, [id])

  const loadCourse = async () => {
    if (!id) return
    
    const { data, error } = await db.getCourse(id)
    if (error) {
      toast.error('Error al cargar el curso')
      return
    }
    
    setCourse(data)
    if (data?.course_chapters?.[0]) {
      setCurrentChapter(data.course_chapters[0])
    }
  }

  const loadProgress = async () => {
    if (!id || !user) return
    
    const { data, error } = await db.getUserProgress(user.id, id)
    if (!error && data) {
      setProgress(data)
    }
    setLoading(false)
  }

  const markChapterComplete = async (chapterId: string) => {
    if (!user || !id) return
    
    const { error } = await db.updateProgress(user.id, id, chapterId)
    if (error) {
      toast.error('Error al marcar capítulo como completado')
      return
    }
    
    toast.success('Capítulo completado!')
    
    // Check if course is now complete and award badge
    await db.awardBadge(user.id, id)
    
    // Reload progress
    loadProgress()
  }

  const isChapterCompleted = (chapterId: string) => {
    return progress.some(p => p.chapter_id === chapterId)
  }

  const getCompletedChaptersCount = () => {
    return progress.length
  }

  const getProgressPercentage = () => {
    if (!course?.course_chapters) return 0
    return Math.round((getCompletedChaptersCount() / course.course_chapters.length) * 100)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Curso no encontrado</p>
        <Link to="/courses" className="text-blue-600 hover:text-blue-700 font-medium">
          Volver a cursos
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/courses"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a cursos
        </Link>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3">
              <div className="h-64 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                {course.thumbnail_url ? (
                  <img 
                    src={course.thumbnail_url} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-white text-center">
                    <Play className="h-16 w-16 mx-auto mb-4" />
                    <span className="text-lg font-medium">{course.module.toUpperCase()}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="md:w-2/3 p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
              <p className="text-gray-600 mb-6">{course.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Duración</p>
                  <p className="font-semibold">{course.duration_hours}h</p>
                </div>
                <div className="text-center">
                  <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Instructor</p>
                  <p className="font-semibold">{course.instructor}</p>
                </div>
                <div className="text-center">
                  <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Nivel</p>
                  <p className="font-semibold capitalize">{course.difficulty}</p>
                </div>
                <div className="text-center">
                  <CheckCircle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Progreso</p>
                  <p className="font-semibold">{getProgressPercentage()}%</p>
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${getProgressPercentage()}%` }}
                />
              </div>
              
              <p className="text-sm text-gray-600">
                {getCompletedChaptersCount()} de {course.course_chapters.length} capítulos completados
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Course content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chapters list */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Contenido del curso
            </h2>
            
            <div className="space-y-3">
              {course.course_chapters
                .sort((a, b) => a.order_index - b.order_index)
                .map((chapter, index) => {
                  const completed = isChapterCompleted(chapter.id)
                  const canAccess = index === 0 || isChapterCompleted(course.course_chapters[index - 1]?.id)
                  
                  return (
                    <motion.div
                      key={chapter.id}
                      whileHover={canAccess ? { scale: 1.02 } : {}}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        currentChapter?.id === chapter.id
                          ? 'border-blue-500 bg-blue-50'
                          : completed
                          ? 'border-green-200 bg-green-50'
                          : canAccess
                          ? 'border-gray-200 hover:border-blue-200'
                          : 'border-gray-100 bg-gray-50 cursor-not-allowed'
                      }`}
                      onClick={() => canAccess && setCurrentChapter(chapter)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            {completed ? (
                              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                            ) : canAccess ? (
                              <Play className="h-5 w-5 text-blue-600 mr-2" />
                            ) : (
                              <Lock className="h-5 w-5 text-gray-400 mr-2" />
                            )}
                            <span className="text-sm font-medium text-gray-700">
                              Capítulo {chapter.order_index}
                            </span>
                          </div>
                          <h3 className={`font-medium ${canAccess ? 'text-gray-900' : 'text-gray-400'}`}>
                            {chapter.title}
                          </h3>
                          <p className={`text-sm ${canAccess ? 'text-gray-500' : 'text-gray-400'}`}>
                            {chapter.duration_minutes} min
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
            </div>
          </div>
        </div>

        {/* Chapter content */}
        <div className="lg:col-span-2">
          {currentChapter ? (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {currentChapter.title}
                  </h2>
                  <p className="text-gray-600">
                    Capítulo {currentChapter.order_index} • {currentChapter.duration_minutes} minutos
                  </p>
                </div>
                
                {!isChapterCompleted(currentChapter.id) && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => markChapterComplete(currentChapter.id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Marcar como completado
                  </motion.button>
                )}
              </div>

              {/* Content viewer */}
              <div className="bg-gray-100 rounded-lg p-8 min-h-96 flex items-center justify-center">
                {currentChapter.content_type === 'video' ? (
                  <div className="text-center">
                    <Play className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Contenido de video</p>
                    <p className="text-sm text-gray-500 mt-2">
                      URL: {currentChapter.content_url}
                    </p>
                  </div>
                ) : currentChapter.content_type === 'document' ? (
                  <div className="text-center">
                    <div className="h-16 w-16 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <span className="text-red-600 font-bold text-sm">PDF</span>
                    </div>
                    <p className="text-gray-600">Documento PDF</p>
                    <a 
                      href={currentChapter.content_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 text-sm mt-2 inline-block"
                    >
                      Abrir documento
                    </a>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="h-16 w-16 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <span className="text-orange-600 font-bold text-sm">PPT</span>
                    </div>
                    <p className="text-gray-600">Presentación</p>
                    <a 
                      href={currentChapter.content_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 text-sm mt-2 inline-block"
                    >
                      Ver presentación
                    </a>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <Play className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                Selecciona un capítulo para comenzar
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}