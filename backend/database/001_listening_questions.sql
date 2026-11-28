
CREATE TABLE IF NOT EXISTS listening_questions (
    id BIGSERIAL PRIMARY KEY,

    listening_lesson_id BIGINT NOT NULL
        REFERENCES listening_lessons(id)
        ON DELETE CASCADE,

    question TEXT NOT NULL,

    options JSONB NOT NULL DEFAULT '[]'::jsonb,

    correct_answer TEXT NOT NULL,

    explanation TEXT,

    question_order INTEGER NOT NULL DEFAULT 1,

    points NUMERIC(6,2) NOT NULL DEFAULT 1,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT listening_questions_order_unique
        UNIQUE (listening_lesson_id, question_order),

    CONSTRAINT listening_questions_points_positive
        CHECK (points > 0)
);

CREATE INDEX IF NOT EXISTS idx_listening_questions_lesson
ON listening_questions(listening_lesson_id);

CREATE INDEX IF NOT EXISTS idx_listening_questions_order
ON listening_questions(listening_lesson_id, question_order);
