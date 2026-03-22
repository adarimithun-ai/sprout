-- Run this in your Supabase project → SQL Editor

-- Growth records
CREATE TABLE IF NOT EXISTS growth (
    id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    w          FLOAT NOT NULL,
    h          FLOAT NOT NULL,
    hc         FLOAT,
    label      TEXT,
    date       TEXT DEFAULT '',
    notes      TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Timeline (milestones + health intakes)
CREATE TABLE IF NOT EXISTS timeline (
    id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    icon       TEXT,
    title      TEXT NOT NULL,
    desc       TEXT DEFAULT '',
    date       TEXT DEFAULT '',
    img_url    TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Memories (photo journal)
CREATE TABLE IF NOT EXISTS memories (
    id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    caption    TEXT DEFAULT '',
    date       TEXT DEFAULT '',
    file_url   TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- App state (key-value: dob, heightUnit, checkboxes, vaccine toggles)
CREATE TABLE IF NOT EXISTS state (
    key TEXT PRIMARY KEY,
    val TEXT NOT NULL
);

-- Storage bucket for photos
-- Run in Supabase Dashboard → Storage → New bucket
-- Name: sprout-media  |  Public: YES
