
-- =========================================
-- ENGLISH UP
-- COMPLETE DATABASE SCHEMA
-- PostgreSQL
-- =========================================

-- =========================================
-- 1. USERS
-- =========================================

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'student'
        CHECK (role IN ('student', 'admin')),
    level VARCHAR(50),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_level ON users(level);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);


-- =========================================
-- 2. SUBSCRIPTIONS
-- =========================================

CREATE TABLE IF NOT EXISTS subscriptions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,
    plan VARCHAR(100) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'expired', 'cancelled', 'pending')),
    start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_date TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (end_date > start_date)
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user
ON subscriptions(user_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_status
ON subscriptions(status);

CREATE INDEX IF NOT EXISTS idx_subscriptions_end_date
ON subscriptions(end_date);


-- =========================================
-- 3. ACTIVATION CODES
-- =========================================

CREATE TABLE IF NOT EXISTS activation_codes (
    id BIGSERIAL PRIMARY KEY,
    code_hash TEXT NOT NULL UNIQUE,
    assigned_user_id BIGINT NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,
    plan VARCHAR(100) NOT NULL,
    duration_days INTEGER NOT NULL CHECK (duration_days > 0),
    used_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activation_codes_user
ON activation_codes(assigned_user_id);

CREATE INDEX IF NOT EXISTS idx_activation_codes_used
ON activation_codes(used_at);


-- =========================================
-- 4. COURSES
-- =========================================

CREATE TABLE IF NOT EXISTS courses (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    level VARCHAR(50) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_courses_level ON courses(level);
CREATE INDEX IF NOT EXISTS idx_courses_active ON courses(is_active);


-- =========================================
-- 5. LESSONS
-- =========================================

CREATE TABLE IF NOT EXISTS lessons (
    id BIGSERIAL PRIMARY KEY,
    course_id BIGINT NOT NULL
        REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    content TEXT,
    audio_url TEXT,
    video_url TEXT,
    pdf_url TEXT,
    lesson_order INTEGER NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(course_id, lesson_order)
);

CREATE INDEX IF NOT EXISTS idx_lessons_course ON lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_active ON lessons(is_active);


-- =========================================
-- 6. VOCABULARY
-- =========================================

CREATE TABLE IF NOT EXISTS vocabulary (
    id BIGSERIAL PRIMARY KEY,
    level VARCHAR(50) NOT NULL,
    day_number INTEGER NOT NULL DEFAULT 1 CHECK (day_number > 0),
    word VARCHAR(200) NOT NULL,
    translation VARCHAR(300) NOT NULL,
    pronunciation VARCHAR(200),
    example TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(level, day_number, word)
);

CREATE INDEX IF NOT EXISTS idx_vocabulary_level_day
ON vocabulary(level, day_number);


-- =========================================
-- 7. LEARNING PROGRESS
-- =========================================

CREATE TABLE IF NOT EXISTS learning_progress (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,
    lesson_id BIGINT NOT NULL
        REFERENCES lessons(id) ON DELETE CASCADE,
    score NUMERIC(5,2) NOT NULL DEFAULT 0
        CHECK (score >= 0 AND score <= 100),
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_progress_user
ON learning_progress(user_id);

CREATE INDEX IF NOT EXISTS idx_progress_lesson
ON learning_progress(lesson_id);


-- =========================================
-- 8. TESTS
-- =========================================

CREATE TABLE IF NOT EXISTS tests (
    id BIGSERIAL PRIMARY KEY,
    course_id BIGINT REFERENCES courses(id) ON DELETE SET NULL,
    lesson_id BIGINT REFERENCES lessons(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    test_type VARCHAR(50) NOT NULL DEFAULT 'general',
    time_limit INTEGER,
    passing_score NUMERIC(5,2) NOT NULL DEFAULT 80,
    is_active BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tests_course ON tests(course_id);
CREATE INDEX IF NOT EXISTS idx_tests_active ON tests(is_active);


CREATE TABLE IF NOT EXISTS test_questions (
    id BIGSERIAL PRIMARY KEY,
    test_id BIGINT NOT NULL
        REFERENCES tests(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    options JSONB NOT NULL DEFAULT '[]'::jsonb,
    correct_answer TEXT NOT NULL,
    explanation TEXT,
    question_order INTEGER NOT NULL DEFAULT 1,
    points NUMERIC(6,2) NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(test_id, question_order)
);

CREATE INDEX IF NOT EXISTS idx_test_questions_test
ON test_questions(test_id);


CREATE TABLE IF NOT EXISTS test_attempts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,
    test_id BIGINT NOT NULL
        REFERENCES tests(id) ON DELETE CASCADE,
    answers JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC(5,2) NOT NULL DEFAULT 0,
    correct_answers INTEGER NOT NULL DEFAULT 0,
    total_questions INTEGER NOT NULL DEFAULT 0,
    passed BOOLEAN NOT NULL DEFAULT FALSE,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_test_attempts_user
ON test_attempts(user_id);

CREATE INDEX IF NOT EXISTS idx_test_attempts_test
ON test_attempts(test_id);

CREATE INDEX IF NOT EXISTS idx_test_attempts_created
ON test_attempts(created_at);


-- =========================================
-- 9. LISTENING
-- =========================================

CREATE TABLE IF NOT EXISTS listening_lessons (
    id BIGSERIAL PRIMARY KEY,
    course_id BIGINT REFERENCES courses(id) ON DELETE SET NULL,
    lesson_id BIGINT REFERENCES lessons(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    level VARCHAR(50),
    audio_key TEXT,
    audio_url TEXT,
    transcript TEXT,
    duration_seconds INTEGER,
    instructions TEXT,
    is_active BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_listening_course
ON listening_lessons(course_id);

CREATE INDEX IF NOT EXISTS idx_listening_active
ON listening_lessons(is_active);


-- =========================================
-- 10. READING
-- =========================================

CREATE TABLE IF NOT EXISTS reading_lessons (
    id BIGSERIAL PRIMARY KEY,
    course_id BIGINT REFERENCES courses(id) ON DELETE SET NULL,
    lesson_id BIGINT REFERENCES lessons(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    level VARCHAR(50),
    passage TEXT NOT NULL,
    instructions TEXT,
    is_active BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reading_course
ON reading_lessons(course_id);

CREATE INDEX IF NOT EXISTS idx_reading_active
ON reading_lessons(is_active);


CREATE TABLE IF NOT EXISTS reading_questions (
    id BIGSERIAL PRIMARY KEY,
    reading_lesson_id BIGINT NOT NULL
        REFERENCES reading_lessons(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    options JSONB NOT NULL DEFAULT '[]'::jsonb,
    correct_answer TEXT NOT NULL,
    explanation TEXT,
    question_order INTEGER NOT NULL DEFAULT 1,
    points NUMERIC(6,2) NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(reading_lesson_id, question_order)
);

CREATE INDEX IF NOT EXISTS idx_reading_questions_lesson
ON reading_questions(reading_lesson_id);


CREATE TABLE IF NOT EXISTS reading_attempts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,
    reading_lesson_id BIGINT NOT NULL
        REFERENCES reading_lessons(id) ON DELETE CASCADE,
    answers JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC(5,2) NOT NULL DEFAULT 0,
    correct_answers INTEGER NOT NULL DEFAULT 0,
    total_questions INTEGER NOT NULL DEFAULT 0,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reading_attempts_user
ON reading_attempts(user_id);

CREATE INDEX IF NOT EXISTS idx_reading_attempts_lesson
ON reading_attempts(reading_lesson_id);


-- =========================================
-- 11. WRITING
-- =========================================

CREATE TABLE IF NOT EXISTS writing_tasks (
    id BIGSERIAL PRIMARY KEY,
    course_id BIGINT REFERENCES courses(id) ON DELETE SET NULL,
    lesson_id BIGINT REFERENCES lessons(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    instructions TEXT,
    task_type VARCHAR(50) DEFAULT 'essay',
    level VARCHAR(50),
    word_limit INTEGER,
    is_active BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_writing_tasks_course
ON writing_tasks(course_id);

CREATE INDEX IF NOT EXISTS idx_writing_tasks_active
ON writing_tasks(is_active);


CREATE TABLE IF NOT EXISTS writing_submissions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,
    task_id BIGINT NOT NULL
        REFERENCES writing_tasks(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    word_count INTEGER NOT NULL DEFAULT 0,
    score NUMERIC(5,2),
    feedback TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'pending',
    reviewed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_writing_submissions_user
ON writing_submissions(user_id);

CREATE INDEX IF NOT EXISTS idx_writing_submissions_task
ON writing_submissions(task_id);

CREATE INDEX IF NOT EXISTS idx_writing_submissions_status
ON writing_submissions(status);


-- =========================================
-- 12. SPEAKING
-- =========================================

CREATE TABLE IF NOT EXISTS speaking_tasks (
    id BIGSERIAL PRIMARY KEY,
    course_id BIGINT REFERENCES courses(id) ON DELETE SET NULL,
    lesson_id BIGINT REFERENCES lessons(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    instructions TEXT,
    level VARCHAR(50),
    time_limit INTEGER,
    is_active BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_speaking_tasks_course
ON speaking_tasks(course_id);

CREATE INDEX IF NOT EXISTS idx_speaking_tasks_active
ON speaking_tasks(is_active);


CREATE TABLE IF NOT EXISTS speaking_questions (
    id BIGSERIAL PRIMARY KEY,
    speaking_task_id BIGINT NOT NULL
        REFERENCES speaking_tasks(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    preparation_seconds INTEGER DEFAULT 0,
    speaking_seconds INTEGER,
    question_order INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(speaking_task_id, question_order)
);

CREATE INDEX IF NOT EXISTS idx_speaking_questions_task
ON speaking_questions(speaking_task_id);


CREATE TABLE IF NOT EXISTS speaking_submissions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,
    task_id BIGINT NOT NULL
        REFERENCES speaking_tasks(id) ON DELETE CASCADE,
    audio_key TEXT NOT NULL,
    duration_seconds INTEGER,
    transcript TEXT,
    score NUMERIC(5,2),
    feedback TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'pending',
    reviewed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_speaking_submissions_user
ON speaking_submissions(user_id);

CREATE INDEX IF NOT EXISTS idx_speaking_submissions_task
ON speaking_submissions(task_id);

CREATE INDEX IF NOT EXISTS idx_speaking_submissions_status
ON speaking_submissions(status);


-- =========================================
-- 13. ANNOUNCEMENTS
-- =========================================

CREATE TABLE IF NOT EXISTS announcements (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    is_active BOOLEAN NOT NULL DEFAULT FALSE,
    publish_at TIMESTAMPTZ,
    created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_announcements_active
ON announcements(is_active);


-- =========================================
-- 14. MESSAGES
-- =========================================

CREATE TABLE IF NOT EXISTS conversations (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,
    subject VARCHAR(200),
    status VARCHAR(30) NOT NULL DEFAULT 'open',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_conversations_user
ON conversations(user_id);

CREATE INDEX IF NOT EXISTS idx_conversations_status
ON conversations(status);


CREATE TABLE IF NOT EXISTS messages (
    id BIGSERIAL PRIMARY KEY,
    conversation_id BIGINT NOT NULL
        REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id BIGINT NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation
ON messages(conversation_id);

CREATE INDEX IF NOT EXISTS idx_messages_sender
ON messages(sender_id);


-- =========================================
-- 15. SECURITY LOGS
-- =========================================

CREATE TABLE IF NOT EXISTS security_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    event_type VARCHAR(100) NOT NULL,
    description TEXT,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_security_logs_user
ON security_logs(user_id);

CREATE INDEX IF NOT EXISTS idx_security_logs_created
ON security_logs(created_at);

CREATE INDEX IF NOT EXISTS idx_security_logs_event
ON security_logs(event_type);


-- =========================================
-- 16. NOTIFICATIONS
-- =========================================

CREATE TABLE IF NOT EXISTS notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'general',
    link TEXT,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user
ON notifications(user_id);

CREATE INDEX IF NOT EXISTS idx_notifications_read
ON notifications(is_read);


-- =========================================
-- 17. BACKUPS
-- =========================================

CREATE TABLE IF NOT EXISTS backups (
    id BIGSERIAL PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    storage_key TEXT NOT NULL,
    file_size BIGINT NOT NULL DEFAULT 0,
    status VARCHAR(30) NOT NULL DEFAULT 'completed',
    created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_backups_created
ON backups(created_at);

CREATE INDEX IF NOT EXISTS idx_backups_status
ON backups(status);


-- =========================================
-- 18. UPDATED_AT FUNCTION
-- =========================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- =========================================
-- 19. UPDATED_AT TRIGGERS
-- =========================================

DROP TRIGGER IF EXISTS users_updated_at ON users;
CREATE TRIGGER users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS subscriptions_updated_at ON subscriptions;
CREATE TRIGGER subscriptions_updated_at
BEFORE UPDATE ON subscriptions
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS courses_updated_at ON courses;
CREATE TRIGGER courses_updated_at
BEFORE UPDATE ON courses
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS lessons_updated_at ON lessons;
CREATE TRIGGER lessons_updated_at
BEFORE UPDATE ON lessons
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS learning_progress_updated_at ON learning_progress;
CREATE TRIGGER learning_progress_updated_at
BEFORE UPDATE ON learning_progress
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS tests_updated_at ON tests;
CREATE TRIGGER tests_updated_at
BEFORE UPDATE ON tests
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS listening_lessons_updated_at ON listening_lessons;
CREATE TRIGGER listening_lessons_updated_at
BEFORE UPDATE ON listening_lessons
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS reading_lessons_updated_at ON reading_lessons;
CREATE TRIGGER reading_lessons_updated_at
BEFORE UPDATE ON reading_lessons
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS writing_tasks_updated_at ON writing_tasks;
CREATE TRIGGER writing_tasks_updated_at
BEFORE UPDATE ON writing_tasks
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS writing_submissions_updated_at ON writing_submissions;
CREATE TRIGGER writing_submissions_updated_at
BEFORE UPDATE ON writing_submissions
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS speaking_tasks_updated_at ON speaking_tasks;
CREATE TRIGGER speaking_tasks_updated_at
BEFORE UPDATE ON speaking_tasks
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS speaking_submissions_updated_at ON speaking_submissions;
CREATE TRIGGER speaking_submissions_updated_at
BEFORE UPDATE ON speaking_submissions
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS conversations_updated_at ON conversations;
CREATE TRIGGER conversations_updated_at
BEFORE UPDATE ON conversations
FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- =========================================
-- END OF ENGLISH UP DATABASE SCHEMA
-- =========================================
