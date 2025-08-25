-- ========== BADGES por curso (1 por curso) ==========
-- APIs REST con Express y PostgreSQL
insert into public.badges (course_id, name, description, icon, color, requirements)
select c.id,
       'APIs REST – Completado',
       'Completó el curso de APIs REST con Express y PostgreSQL',
       '🏅',
       '#6D28D9',
       jsonb_build_object('rule', 'complete_all_chapters')
from public.courses c
where c.title = 'APIs REST con Express y PostgreSQL'
  and not exists (
    select 1 from public.badges b where b.course_id = c.id
  );

-- Node.js Avanzado y Microservicios
insert into public.badges (course_id, name, description, icon, color, requirements)
select c.id,
       'Node Avanzado – Completado',
       'Completó el curso de Node.js Avanzado y Microservicios',
       '🏅',
       '#059669',
       jsonb_build_object('rule', 'complete_all_chapters')
from public.courses c
where c.title = 'Node.js Avanzado y Microservicios'
  and not exists (
    select 1 from public.badges b where b.course_id = c.id
  );

-- Data Science con Python
insert into public.badges (course_id, name, description, icon, color, requirements)
select c.id,
       'Data Science – Completado',
       'Completó el curso de Data Science con Python',
       '🏅',
       '#2563EB',
       jsonb_build_object('rule', 'complete_all_chapters')
from public.courses c
where c.title = 'Data Science con Python'
  and not exists (
    select 1 from public.badges b where b.course_id = c.id
  );

-- ========== CAPÍTULOS ==========

-- ===== APIs REST con Express y PostgreSQL =====
insert into public.course_chapters
  (course_id, title, description, content_url, content_type, duration_minutes, order_index, is_required)
select
  c.id, 'Introducción a Express', 'Capítulo introductorio',
  'https://example.com/videos/express-intro.mp4', 'video', 50, 1, true
from public.courses c
where c.title = 'APIs REST con Express y PostgreSQL'
  and not exists (
    select 1 from public.course_chapters ch
    where ch.course_id = c.id and ch.order_index = 1
  );

insert into public.course_chapters
  (course_id, title, description, content_url, content_type, duration_minutes, order_index, is_required)
select
  c.id, 'Routing y Middleware', 'Construcción de rutas y middlewares',
  'https://example.com/docs/express-routing.pdf', 'document', 55, 2, false
from public.courses c
where c.title = 'APIs REST con Express y PostgreSQL'
  and not exists (
    select 1 from public.course_chapters ch
    where ch.course_id = c.id and ch.order_index = 2
  );

-- ===== Node.js Avanzado y Microservicios =====
insert into public.course_chapters
  (course_id, title, description, content_url, content_type, duration_minutes, order_index, is_required)
select
  c.id, 'Arquitectura de Microservicios', 'Patrones y diseño',
  'https://example.com/videos/node-microservices-arch.mp4', 'video', 60, 1, true
from public.courses c
where c.title = 'Node.js Avanzado y Microservicios'
  and not exists (
    select 1 from public.course_chapters ch
    where ch.course_id = c.id and ch.order_index = 1
  );

insert into public.course_chapters
  (course_id, title, description, content_url, content_type, duration_minutes, order_index, is_required)
select
  c.id, 'Comunicación y Mensajería', 'Mensajería entre servicios',
  'https://example.com/docs/node-messaging.pdf', 'document', 45, 2, false
from public.courses c
where c.title = 'Node.js Avanzado y Microservicios'
  and not exists (
    select 1 from public.course_chapters ch
    where ch.course_id = c.id and ch.order_index = 2
  );

-- ===== Data Science con Python =====
insert into public.course_chapters
  (course_id, title, description, content_url, content_type, duration_minutes, order_index, is_required)
select
  c.id, 'Entorno de Trabajo', 'Entorno, notebooks y librerías',
  'https://example.com/videos/python-ds-env.mp4', 'video', 35, 1, true
from public.courses c
where c.title = 'Data Science con Python'
  and not exists (
    select 1 from public.course_chapters ch
    where ch.course_id = c.id and ch.order_index = 1
  );

insert into public.course_chapters
  (course_id, title, description, content_url, content_type, duration_minutes, order_index, is_required)
select
  c.id, 'Numpy y Pandas', 'Manipulación de datos',
  'https://example.com/docs/numpy-pandas.pdf', 'document', 40, 2, false
from public.courses c
where c.title = 'Data Science con Python'
  and not exists (
    select 1 from public.course_chapters ch
    where ch.course_id = c.id and ch.order_index = 2
  );
