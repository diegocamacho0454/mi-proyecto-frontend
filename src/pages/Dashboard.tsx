import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  Award, 
  Clock, 
  TrendingUp, 
  Users,
  CheckCircle,
  Target,
  Calendar
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useAuthContext } from '../contexts/AuthContext'
import { db } from '../lib/supabase'
import CourseCard from '../components/courses/CourseCard'

export default function Dashboard() {
  const { user } = useAuthContext()
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    badges: 0,
    hoursLearned: 0
  })
  const [recentCourses, setRecentCourses] = useState([])
  const [progressData, setProgressData] = useState([])
  const [moduleData, setModuleData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadDashboardData()
    }
  }, [user])

  const loadDashboardData = async () => {
    try {
      // Load courses
      const { data: courses } = await db.getCourses()
      
      // Load user progress
      const { data: progress } = await db.getUserProgress(user!.id)
      
      // Load user badges
      const { data: badges } = await db.getUserBadges(user!.id)
      
      // Calculate stats
      const completedCourseIds = new Set()
      let totalHours = 0
      
      if (progress) {
        progress.forEach(p => {
          if (p.courses) {
            completedCourseIds.add(p.course_id)
            totalHours += p.courses.duration_hours || 0
          }
        })
      }

      setStats({
        totalCourses: courses?.length || 0,
        completedCourses: completedCourseIds.size,
        badges: badges?.length || 0,
        hoursLearned: totalHours
      })

      // Set recent courses
      setRecentCourses(courses?.slice(0, 3) || [])

      // Generate progress data for chart
      const moduleProgress = {
        fullstack: 0,
        apis: 0,
        cloud: 0,
        data: 0
      }

      if (courses && progress) {
        courses.forEach(course => {
          const courseProgress = progress.filter(p => p.course_id === course.id)
          const progressPercentage = course.course_chapters 
            ? (courseProgress.length / course.course_chapters.length) * 100
            : 0
          
          if (moduleProgress.hasOwnProperty(course.module)) {
            moduleProgress[course.module as keyof typeof moduleProgress] += progressPercentage
          }
        })
      }

      setProgressData([
        { name: 'Fullstack', progress: Math.round(moduleProgress.fullstack) },
        { name: 'APIs', progress: Math.round(moduleProgress.apis) },
        { name: 'Cloud', progress: Math.round(moduleProgress.cloud) },
        { name: 'Data', progress: Math.round(moduleProgress.data) }
      ])

      // Generate module distribution data
      const moduleCount = { fullstack: 0, apis: 0, cloud: 0, data: 0 }
      if (courses) {
        courses.forEach(course => {
          if (moduleCount.hasOwnProperty(course.module)) {
            moduleCount[course.module as keyof typeof moduleCount]++
          }
        })
      }

      setModuleData([
        { name: 'Fullstack', value: moduleCount.fullstack, color: '#3B82F6' },
        { name: 'APIs', value: moduleCount.apis, color: '#10B981' },
        { name: 'Cloud', value: moduleCount.cloud, color: '#8B5CF6' },
        { name: 'Data', value: moduleCount.data, color: '#F59E0B' }
      ])

    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Cursos Disponibles',
      value: stats.totalCourses,
      icon: BookOpen,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Cursos Completados',
      value: stats.completedCourses,
      icon: CheckCircle,
      color: 'bg-green-500',
      change: '+23%'
    },
    {
      title: 'Insignias Ganadas',
      value: stats.badges,
      icon: Award,
      color: 'bg-purple-500',
      change: '+8%'
    },
    {
      title: 'Horas de Aprendizaje',
      value: stats.hoursLearned,
      icon: Clock,
      color: 'bg-orange-500',
      change: '+15%'
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white"
      >
        <h1 className="text-3xl font-bold mb-2">
          ¡Bienvenido, {user?.user_metadata?.full_name || user?.email}!
        </h1>
        <p className="text-blue-100">
          Continúa tu camino de aprendizaje en el CoE. Tienes {stats.totalCourses - stats.completedCourses} cursos pendientes.
        </p>
      </motion.div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">{stat.change}</span>
                </div>
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Progress chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Target className="h-5 w-5 mr-2 text-blue-600" />
            Progreso por Módulo
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="progress" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Module distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Users className="h-5 w-5 mr-2 text-purple-600" />
            Distribución de Cursos
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={moduleData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {moduleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {moduleData.map((item) => (
              <div key={item.name} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent courses */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-green-600" />
            Cursos Recientes
          </h2>
          <a 
            href="/courses" 
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            Ver todos
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </motion.div>
    </div>
  )
}