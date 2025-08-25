import React from 'react'
import { motion } from 'framer-motion'
import { Clock, Users, Award, Play, CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

interface CourseCardProps {
  course: {
    id: string
    title: string
    description: string
    module: string
    duration_hours: number
    difficulty: string
    instructor: string
    thumbnail_url?: string
    total_chapters?: number
    completed_chapters?: number
  }
  progress?: number
}

export default function CourseCard({ course, progress = 0 }: CourseCardProps) {
  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800'
  }

  const moduleColors = {
    fullstack: 'bg-blue-500',
    apis: 'bg-green-500',
    cloud: 'bg-purple-500',
    data: 'bg-orange-500'
  }

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl"
    >
      <div className="relative">
        <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
          {course.thumbnail_url ? (
            <img 
              src={course.thumbnail_url} 
              alt={course.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-white text-center">
              <Play className="h-12 w-12 mx-auto mb-2" />
              <span className="text-sm font-medium">{course.module.toUpperCase()}</span>
            </div>
          )}
        </div>
        
        {/* Progress bar */}
        {progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
            <div 
              className="h-full bg-green-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Module badge */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${moduleColors[course.module as keyof typeof moduleColors] || 'bg-gray-500'}`}>
            {course.module}
          </span>
        </div>

        {/* Completion badge */}
        {progress === 100 && (
          <div className="absolute top-3 right-3">
            <CheckCircle className="h-6 w-6 text-green-500 bg-white rounded-full" />
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${difficultyColors[course.difficulty as keyof typeof difficultyColors] || 'bg-gray-100 text-gray-800'}`}>
            {course.difficulty}
          </span>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            {course.duration_hours}h
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {course.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {course.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <Users className="h-4 w-4 mr-1" />
            {course.instructor}
          </div>
          {course.total_chapters && (
            <div className="flex items-center text-sm text-gray-500">
              <Award className="h-4 w-4 mr-1" />
              {course.completed_chapters || 0}/{course.total_chapters} capítulos
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <Link
            to={`/courses/${course.id}`}
            className="flex-1 mr-3"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              {progress > 0 ? 'Continuar' : 'Comenzar'}
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}