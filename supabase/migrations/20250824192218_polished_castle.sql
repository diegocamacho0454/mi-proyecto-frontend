/*
  # Sample Data for Learning Platform

  1. Sample Courses
    - Creates realistic courses for each module
    - Different difficulty levels and durations
    
  2. Course Chapters  
    - Multi-chapter structure for each course
    - Mixed content types (video, document, presentation)
    
  3. Badges
    - Automatic badge creation for course completion
    - Color coding by module
*/

-- Insertar cursos de muestra
INSERT INTO courses (title, description, module, difficulty, duration_hours, instructor, learning_objectives, prerequisites) VALUES

-- Módulo Fullstack
('Fundamentos de React', 
 'Domina los conceptos esenciales de React incluyendo componentes funcionales, hooks, estado local y props. Aprende a crear interfaces de usuario interactivas y reutilizables.', 
 'fullstack', 'beginner', 8, 'Ana García Martínez',
 ARRAY['Crear componentes funcionales', 'Manejar estado con hooks', 'Implementar props correctamente', 'Construir una SPA básica'],
 ARRAY['HTML básico', 'CSS básico', 'JavaScript ES6']),

('Node.js Avanzado y Microservicios', 
 'Desarrolla aplicaciones backend escalables con Node.js. Implementa patrones de microservicios, manejo de errores avanzado y optimización de rendimiento.', 
 'fullstack', 'advanced', 15, 'Carlos Ruiz Mendoza',
 ARRAY['Arquitectura de microservicios', 'Manejo avanzado de errores', 'Optimización de rendimiento', 'Testing y deployment'],
 ARRAY['JavaScript intermedio', 'Node.js básico', 'Bases de datos relacionales']),

('Full Stack con MERN', 
 'Construye aplicaciones completas usando MongoDB, Express, React y Node.js. Proyecto real desde el diseño hasta el deployment.', 
 'fullstack', 'intermediate', 20, 'Laura Fernández Silva',
 ARRAY['Stack MERN completo', 'Autenticación JWT', 'Deployment en cloud', 'Testing end-to-end'],
 ARRAY['React básico', 'Node.js básico', 'Bases de datos NoSQL']),

-- Módulo APIs
('APIs REST con Express y PostgreSQL', 
 'Diseña y construye APIs RESTful robustas con Express.js, validación de datos, autenticación JWT y integración con PostgreSQL.', 
 'apis', 'intermediate', 12, 'María López Torres',
 ARRAY['Diseño de APIs RESTful', 'Autenticación y autorización', 'Validación de datos', 'Documentación con Swagger'],
 ARRAY['Node.js básico', 'JavaScript ES6', 'Bases de datos relacionales']),

('IBM DataPower Gateway', 
 'Implementa y configura IBM DataPower para el manejo de servicios web, transformaciones XML/JSON y políticas de seguridad empresarial.', 
 'apis', 'advanced', 16, 'Roberto Díaz Campos',
 ARRAY['Configuración de DataPower', 'Políticas de seguridad', 'Transformaciones de datos', 'Monitoreo y logging'],
 ARRAY['Servicios web', 'XML/JSON', 'Conceptos de ESB']),

('GraphQL y APIs Modernas', 
 'Desarrolla APIs flexibles y eficientes con GraphQL. Aprende queries, mutations, subscriptions y mejores prácticas de implementación.', 
 'apis', 'intermediate', 10, 'Patricia Morales Ruiz',
 ARRAY['Diseño de schemas GraphQL', 'Resolvers eficientes', 'Subscriptions en tiempo real', 'Testing de APIs GraphQL'],
 ARRAY['APIs REST', 'JavaScript avanzado', 'Node.js intermedio']),

-- Módulo Cloud
('AWS Fundamentos y Servicios Básicos', 
 'Introducción completa a Amazon Web Services. Explora EC2, S3, RDS, Lambda y servicios de red fundamentales para arquitecturas cloud.', 
 'cloud', 'beginner', 18, 'Elena Torres Vega',
 ARRAY['Servicios core de AWS', 'Arquitecturas básicas', 'Seguridad en AWS', 'Costos y optimización'],
 ARRAY['Conceptos de redes', 'Linux básico']),

('Kubernetes y Orquestación', 
 'Domina la orquestación de contenedores con Kubernetes. Desde pods básicos hasta deployments complejos en producción.', 
 'cloud', 'advanced', 22, 'Miguel Ángel Soto',
 ARRAY['Arquitectura de Kubernetes', 'Deployments y services', 'Monitoreo y logging', 'Seguridad en K8s'],
 ARRAY['Docker', 'Linux intermedio', 'Conceptos de redes']),

('DevOps con CI/CD', 
 'Implementa pipelines de integración y deployment continuo usando Jenkins, GitLab CI, Docker y herramientas de automatización.', 
 'cloud', 'intermediate', 14, 'Andrea Jiménez López',
 ARRAY['Pipelines CI/CD', 'Automatización de testing', 'Infrastructure as Code', 'Monitoreo de aplicaciones'],
 ARRAY['Git avanzado', 'Docker básico', 'Scripting']),

-- Módulo Data
('Apache Spark para Big Data', 
 'Procesamiento distribuido de grandes volúmenes de datos con Apache Spark. RDDs, DataFrames, SQL y machine learning básico.', 
 'data', 'advanced', 25, 'Francisco Herrera Molina',
 ARRAY['Arquitectura de Spark', 'Procesamiento distribuido', 'Spark SQL y DataFrames', 'MLlib básico'],
 ARRAY['Python avanzado', 'SQL avanzado', 'Conceptos de big data']),

('ETL con Apache Airflow', 
 'Diseña y programa flujos de trabajo de datos complejos usando Apache Airflow. Orchestración, monitoreo y mejores prácticas.', 
 'data', 'intermediate', 12, 'Carmen Silva Ramos',
 ARRAY['Diseño de DAGs', 'Operadores de Airflow', 'Monitoreo de workflows', 'Manejo de errores'],
 ARRAY['Python intermedio', 'SQL básico', 'Conceptos de ETL']),

('Data Science con Python', 
 'Análisis de datos completo con Python. Pandas, NumPy, visualización con Matplotlib/Seaborn y machine learning con scikit-learn.', 
 'data', 'beginner', 16, 'José Manuel Cruz Delgado',
 ARRAY['Manipulación de datos', 'Visualización efectiva', 'Machine learning básico', 'Proyectos reales'],
 ARRAY['Python básico', 'Estadística básica', 'Matemáticas básicas']);

-- Insertar capítulos para algunos cursos
-- Capítulos para "Fundamentos de React"
INSERT INTO course_chapters (course_id, title, description, content_url, content_type, duration_minutes, order_index) 
SELECT 
  c.id,
  chapter_data.title,
  chapter_data.description,
  chapter_data.content_url,
  chapter_data.content_type,
  chapter_data.duration_minutes,
  chapter_data.order_index
FROM courses c,
(VALUES 
  ('Introducción y Setup', 'Configuración del entorno de desarrollo y conceptos básicos de React', 'https://example.com/videos/react-intro.mp4', 'video', 45, 1),
  ('Componentes y JSX', 'Aprende a crear componentes funcionales y usar JSX efectivamente', 'https://example.com/videos/react-components.mp4', 'video', 60, 2),
  ('Props y Comunicación', 'Manejo de props y comunicación entre componentes padre e hijo', 'https://example.com/videos/react-props.mp4', 'video', 50, 3),
  ('Estado y Hooks', 'useState, useEffect y otros hooks fundamentales', 'https://example.com/videos/react-hooks.mp4', 'video', 65, 4),
  ('Manejo de Eventos', 'Eventos sintéticos y manejo de formularios en React', 'https://example.com/videos/react-events.mp4', 'video', 40, 5),
  ('Proyecto Final', 'Construye una aplicación completa aplicando todos los conceptos', 'https://example.com/documents/react-final-project.pdf', 'document', 90, 6)
) AS chapter_data(title, description, content_url, content_type, duration_minutes, order_index)
WHERE c.title = 'Fundamentos de React';

-- Capítulos para "APIs REST con Express y PostgreSQL"
INSERT INTO course_chapters (course_id, title, description, content_url, content_type, duration_minutes, order_index) 
SELECT 
  c.id,
  chapter_data.title,
  chapter_data.description,
  chapter_data.content_url,
  chapter_data.content_type,
  chapter_data.duration_minutes,
  chapter_data.order_index
FROM courses c,
(VALUES 
  ('Introducción a Express', 'Setup inicial y conceptos básicos de Express.js', 'https://example.com/videos/express-intro.mp4', 'video', 50, 1),
  ('Routing y Middleware', 'Sistema de rutas y middlewares personalizados', 'https://example.com/videos/express-routing.mp4', 'video', 55, 2),
  ('Conexión con PostgreSQL', 'Integración con bases de datos y queries básicas', 'https://example.com/videos/express-postgres.mp4', 'video', 60, 3),
  ('Validación y Manejo de Errores', 'Validación de datos de entrada y manejo robusto de errores', 'https://example.com/videos/express-validation.mp4', 'video', 45, 4),
  ('Autenticación JWT', 'Implementación de autenticación con JSON Web Tokens', 'https://example.com/videos/express-auth.mp4', 'video', 70, 5),
  ('Testing y Documentación', 'Testing unitario e integración, documentación con Swagger', 'https://example.com/documents/express-testing-docs.pdf', 'document', 80, 6)
) AS chapter_data(title, description, content_url, content_type, duration_minutes, order_index)
WHERE c.title = 'APIs REST con Express y PostgreSQL';

-- Capítulos para "AWS Fundamentos y Servicios Básicos"
INSERT INTO course_chapters (course_id, title, description, content_url, content_type, duration_minutes, order_index) 
SELECT 
  c.id,
  chapter_data.title,
  chapter_data.description,
  chapter_data.content_url,
  chapter_data.content_type,
  chapter_data.duration_minutes,
  chapter_data.order_index
FROM courses c,
(VALUES 
  ('Introducción a AWS', 'Conceptos básicos de cloud computing y servicios de AWS', 'https://example.com/videos/aws-intro.mp4', 'video', 40, 1),
  ('EC2 - Compute Services', 'Instancias EC2, tipos, configuración y mejores prácticas', 'https://example.com/videos/aws-ec2.mp4', 'video', 75, 2),
  ('S3 - Storage Solutions', 'Simple Storage Service, buckets, políticas y casos de uso', 'https://example.com/videos/aws-s3.mp4', 'video', 60, 3),
  ('RDS - Managed Databases', 'Bases de datos relacionales gestionadas en AWS', 'https://example.com/videos/aws-rds.mp4', 'video', 55, 4),
  ('VPC y Networking', 'Redes virtuales privadas, subnets y grupos de seguridad', 'https://example.com/videos/aws-networking.mp4', 'video', 70, 5),
  ('Lambda - Serverless', 'Funciones serverless y arquitecturas event-driven', 'https://example.com/videos/aws-lambda.mp4', 'video', 50, 6),
  ('IAM y Seguridad', 'Identity and Access Management, roles y políticas', 'https://example.com/videos/aws-iam.mp4', 'video', 65, 7),
  ('Proyecto Práctico', 'Arquitectura completa integrando múltiples servicios', 'https://example.com/presentations/aws-project.pptx', 'presentation', 120, 8)
) AS chapter_data(title, description, content_url, content_type, duration_minutes, order_index)
WHERE c.title = 'AWS Fundamentos y Servicios Básicos';

-- Capítulos para "Apache Spark para Big Data"
INSERT INTO course_chapters (course_id, title, description, content_url, content_type, duration_minutes, order_index) 
SELECT 
  c.id,
  chapter_data.title,
  chapter_data.description,
  chapter_data.content_url,
  chapter_data.content_type,
  chapter_data.duration_minutes,
  chapter_data.order_index
FROM courses c,
(VALUES 
  ('Introducción a Big Data', 'Conceptos de big data y ecosistema Hadoop/Spark', 'https://example.com/videos/bigdata-intro.mp4', 'video', 50, 1),
  ('Arquitectura de Spark', 'Componentes, driver, executors y cluster modes', 'https://example.com/videos/spark-architecture.mp4', 'video', 60, 2),
  ('RDDs y Operaciones Básicas', 'Resilient Distributed Datasets y transformaciones', 'https://example.com/videos/spark-rdds.mp4', 'video', 75, 3),
  ('DataFrames y Spark SQL', 'API estructurada y consultas SQL en Spark', 'https://example.com/videos/spark-sql.mp4', 'video', 80, 4),
  ('Streaming en Tiempo Real', 'Spark Streaming y procesamiento de datos en tiempo real', 'https://example.com/videos/spark-streaming.mp4', 'video', 70, 5),
  ('Machine Learning con MLlib', 'Algoritmos de ML distribuido y pipelines', 'https://example.com/videos/spark-ml.mp4', 'video', 85, 6),
  ('Optimización y Tuning', 'Performance tuning y mejores prácticas de optimización', 'https://example.com/documents/spark-optimization.pdf', 'document', 60, 7),
  ('Proyecto Big Data', 'Caso práctico procesando datasets reales', 'https://example.com/presentations/spark-project.pptx', 'presentation', 150, 8)
) AS chapter_data(title, description, content_url, content_type, duration_minutes, order_index)
WHERE c.title = 'Apache Spark para Big Data';

-- Crear badges automáticas para todos los cursos
INSERT INTO badges (course_id, name, description, icon, color)
SELECT 
  id,
  'Completado: ' || title,
  'Has completado exitosamente el curso "' || title || '" demostrando dominio en ' || 
  CASE module
    WHEN 'fullstack' THEN 'desarrollo full stack'
    WHEN 'apis' THEN 'APIs e integraciones'
    WHEN 'cloud' THEN 'tecnologías cloud'
    WHEN 'data' THEN 'ingeniería de datos'
    ELSE 'habilidades técnicas'
  END || '.',
  'award',
  CASE module
    WHEN 'fullstack' THEN '#3B82F6'
    WHEN 'apis' THEN '#10B981'
    WHEN 'cloud' THEN '#8B5CF6'
    WHEN 'data' THEN '#F59E0B'
    ELSE '#6B7280'
  END
FROM courses;

-- Badges especiales por nivel de dificultad
INSERT INTO badges (course_id, name, description, icon, color)
SELECT 
  c.id,
  CASE c.difficulty
    WHEN 'beginner' THEN 'Primer Paso - ' || c.title
    WHEN 'intermediate' THEN 'En Progreso - ' || c.title
    WHEN 'advanced' THEN 'Experto - ' || c.title
  END,
  CASE c.difficulty
    WHEN 'beginner' THEN 'Felicitaciones por dar el primer paso en tu journey de aprendizaje'
    WHEN 'intermediate' THEN 'Has demostrado habilidades intermedias en esta área técnica'
    WHEN 'advanced' THEN '¡Excelente! Has alcanzado nivel experto en esta tecnología'
  END,
  CASE c.difficulty
    WHEN 'beginner' THEN 'star'
    WHEN 'intermediate' THEN 'trending-up'
    WHEN 'advanced' THEN 'crown'
  END,
  CASE c.difficulty
    WHEN 'beginner' THEN '#22C55E'
    WHEN 'intermediate' THEN '#F59E0B'
    WHEN 'advanced' THEN '#DC2626'
  END
FROM courses c;