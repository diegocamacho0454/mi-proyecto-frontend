/*
  # Portal de Capacitaciones - Schema Database

  1. New Tables
    - `users` - Perfiles extendidos de usuarios
    - `courses` - Catálogo de cursos por módulos
    - `course_chapters` - Capítulos/contenido de cada curso  
    - `user_progress` - Seguimiento de progreso por usuario
    - `badges` - Definición de insignias por curso
    - `user_badges` - Insignias otorgadas a usuarios

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Granular access control per table

  3. Sample Data
    - Demo courses for each module
    - Chapter structure with multimedia content
    - Badge system setup
*/

-- Tabla de usuarios extendida
CREATE TABLE IF NOT EXISTS users (
  id uuid REFERENCES auth.users(id) PRIMARY KEY,
  full_name text NOT NULL,
  department text NOT NULL,
  role text DEFAULT 'student' CHECK (role IN ('student', 'instructor', 'admin')),
  avatar_url text,
  bio text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabla de cursos
CREATE TABLE IF NOT EXISTS courses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  module text NOT NULL CHECK (module IN ('fullstack', 'apis', 'cloud', 'data')),
  difficulty text NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  duration_hours integer NOT NULL DEFAULT 0,
  instructor text NOT NULL,
  thumbnail_url text,
  prerequisites text[],
  learning_objectives text[],
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabla de capítulos de cursos
CREATE TABLE IF NOT EXISTS course_chapters (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  content_url text NOT NULL,
  content_type text NOT NULL CHECK (content_type IN ('video', 'document', 'presentation', 'quiz')),
  duration_minutes integer NOT NULL DEFAULT 0,
  order_index integer NOT NULL,
  is_required boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Tabla de progreso de usuarios
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  chapter_id uuid REFERENCES course_chapters(id) ON DELETE CASCADE,
  completed_at timestamptz DEFAULT now(),
  score integer CHECK (score >= 0 AND score <= 100),
  notes text,
  UNIQUE(user_id, course_id, chapter_id)
);

-- Tabla de definición de insignias
CREATE TABLE IF NOT EXISTS badges (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL DEFAULT 'award',
  color text NOT NULL DEFAULT '#3B82F6',
  requirements jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Tabla de insignias otorgadas
CREATE TABLE IF NOT EXISTS user_badges (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  badge_id uuid REFERENCES badges(id) ON DELETE CASCADE,
  earned_at timestamptz DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Tabla de notificaciones
CREATE TABLE IF NOT EXISTS notifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL CHECK (type IN ('course_available', 'course_completed', 'badge_earned', 'system')),
  read boolean DEFAULT false,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Habilitar Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad para users
CREATE POLICY "Users can read own profile" 
  ON users FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON users FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON users FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Políticas para courses (lectura pública para autenticados)
CREATE POLICY "Authenticated users can read courses" 
  ON courses FOR SELECT 
  TO authenticated 
  USING (is_published = true);

-- Políticas para course_chapters (lectura pública para autenticados)
CREATE POLICY "Authenticated users can read chapters" 
  ON course_chapters FOR SELECT 
  TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM courses 
    WHERE courses.id = course_chapters.course_id 
    AND courses.is_published = true
  ));

-- Políticas para user_progress
CREATE POLICY "Users can read own progress" 
  ON user_progress FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" 
  ON user_progress FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" 
  ON user_progress FOR UPDATE 
  USING (auth.uid() = user_id);

-- Políticas para badges (lectura pública)
CREATE POLICY "Authenticated users can read badges" 
  ON badges FOR SELECT 
  TO authenticated 
  USING (true);

-- Políticas para user_badges
CREATE POLICY "Users can read own badges" 
  ON user_badges FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own badges" 
  ON user_badges FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Políticas para notifications
CREATE POLICY "Users can read own notifications" 
  ON notifications FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" 
  ON notifications FOR UPDATE 
  USING (auth.uid() = user_id);

-- Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_courses_module ON courses(module);
CREATE INDEX IF NOT EXISTS idx_courses_difficulty ON courses(difficulty);
CREATE INDEX IF NOT EXISTS idx_course_chapters_course_id ON course_chapters(course_id);
CREATE INDEX IF NOT EXISTS idx_course_chapters_order ON course_chapters(course_id, order_index);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_course_id ON user_progress(course_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id, read);

-- Función para actualizar timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();