
-- =========================================
-- ENGLISH UP
-- DATABASE SCHEMA
-- PostgreSQL
-- =========================================

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'student'
        CHECK (role IN ('student', 'admin')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email
ON users(email);

CREATE INDEX IF NOT EXISTS idx_users_role
ON users(role);


-- =========================================
-- SUBSCRIPTIONS
-- =========================================

CREATE TABLE IF NOT EXISTS subscriptions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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
-- ACTIVATION CODES
-- =========================================

CREATE TABLE IF NOT EXISTS activation_codes (
    id BIGSERIAL PRIMARY KEY,
    code_hash TEXT NOT NULL UNIQUE,
    assigned_user_id BIGINT NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,
    plan VARCHAR(100) NOT NULL,
    duration_days INTEGER NOT NULL
        CHECK (duration_days > 0),
    used_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activation_codes_user
ON activation_codes(assigned_user_id);

CREATE INDEX IF NOT EXISTS idx_activation_codes_used
ON activation_codes(used_at);


-- =========================================
-- COURSES
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

CREATE INDEX IF NOT EXISTS idx_courses_level
ON courses(level);

CREATE INDEX IF NOT EXISTS idx_courses_active
ON courses(is_active);


-- =========================================
-- LESSONS
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

CREATE INDEX IF NOT EXISTS idx_lessons_course
ON lessons(course_id);

CREATE INDEX IF NOT EXISTS idx_lessons_active
ON lessons(is_active);


-- =========================================
-- VOCABULARY
-- =========================================

CREATE TABLE IF NOT EXISTS vocabulary (
    id BIGSERIAL PRIMARY KEY,
    level VARCHAR(50) NOT NULL,
    day_number INTEGER NOT NULL DEFAULT 1
        CHECK (day_number > 0),
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
-- LEARNING PROGRESS
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
-- UPDATED_AT TRIGGER
-- =========================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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


-- =========================================
-- END OF ENGLISH UP SCHEMA
-- =========================================
