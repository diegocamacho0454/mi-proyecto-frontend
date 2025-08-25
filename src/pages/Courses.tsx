import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Filter, Code, Cpu, Cloud, Database, Plus } from 'lucide-react'
import { db } from '../lib/supabase'
import { useAuthContext } from '../contexts/AuthContext'
import CourseCard from '../components/courses/CourseCard'

const modules = [
  { id: 'all', name: 'Todos los Módulos', icon: Filter, color: 'text-gray-500' },
  { id: 'fullstack', name: 'Fullstack', icon: Code, color: 'text-blue-500' },
  { id: 'apis', name: 'APIs e Integraciones', icon: Cpu, color: 'text-green-500' },
  { id: 'cloud', name: 'Cloud', icon: Cloud, color: 'text-purple-500' },
  { id: 'data', name: 'Data Engineer', icon: Database, color: 'text-orange-500' }
]

const difficulties = ['all', 'beginner', 'intermediate', 'advanced']

export default function Courses() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { user } = useAuthContext()
  const [courses, setCourses] = useState([])
  const [filteredCourses, setFilteredCourses] = useState([])
  const [userProgress, setUserProgress] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedModule, setSelectedModule] = useState(searchParams.get('module') || 'all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')

  useEffect(() => {
    loadCourses()
    if (user) {
      loadUserProgress()
    }
  }, [user])

  useEffect(() => {
    filterCourses()
  }, [courses, searchTerm, selectedModule, selectedDifficulty, userProgress])

  useEffect(() => {
    const module = searchParams.get('module')
    if (module && module !== selectedModule) {
      setSelectedModule(module)
    }
  }, [searchParams])

  const loadCourses = async () => {
    const { data, error } = await db.getCourses()
    if (!error && data) {
      setCourses(data)
    }
    setLoading(false)
  }

  const loadUserProgress = async () => {
    if (!user) return
    
    const { data, error } = await db.getUserProgress(user.id)
    if (!error && data) {
      setUserProgress(data)
    }
  }

  const filterCourses = () => {
    let filtered = [...courses]

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by module
    if (selectedModule !== 'all') {
      filtered = filtered.filter(course => course.module === selectedModule)
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(course => course.difficulty === selectedDifficulty)
    }

    setFilteredCourses(filtered)
  }

  const getCourseProgress = (courseId: string) => {
    const courseProgressData = userProgress.filter(p => p.course_id === courseId)
    const course = courses.find(c => c.id === courseId)
    
    if (!course || !course.course_chapters) return 0
    
    const totalChapters = course.course_chapters.length
    const completedChapters = courseProgressData.length
    
    return Math.round((completedChapters / totalChapters) * 100)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Catálogo de Cursos</h1>
          <p className="mt-2 text-gray-600">
            Explora nuestros cursos y mejora tus habilidades técnicas
          </p>
        </div>
        
        {/* Future: Add course button for admins */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Sugerir Curso
        </motion.button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar cursos
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Buscar por título, descripción..."
              />
            </div>
          </div>

          {/* Module filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Módulo
            </label>
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {modules.map(module => (
                <option key={module.id} value={module.id}>
                  {module.name}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nivel
            </label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todos los niveles</option>
              <option value="beginner">Principiante</option>
              <option value="intermediate">Intermedio</option>
              <option value="advanced">Avanzado</option>
            </select>
          </div>
        </div>

        {/* Module pills */}
        <div className="mt-6 flex flex-wrap gap-2">
          {modules.map(module => {
            const IconComponent = module.icon
            return (
              <motion.button
                key={module.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedModule(module.id)}
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedModule === module.id
                    ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-transparent'
                }`}
              >
                <IconComponent className={`h-4 w-4 mr-2 ${module.color}`} />
                {module.name}
              </motion.button>
            )
          })}
        </div>
      </motion.div>

      {/* Results */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {filteredCourses.length} curso{filteredCourses.length !== 1 ? 's' : ''} encontrado{filteredCourses.length !== 1 ? 's' : ''}
          </h2>
        </div>

        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
              <Search className="h-full w-full" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron cursos
            </h3>
            <p className="text-gray-500">
              Intenta ajustar los filtros de búsqueda
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <CourseCard 
                  course={course} 
                  progress={getCourseProgress(course.id)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}