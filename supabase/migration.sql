-- ============================================================
-- BPJS Registration App — Supabase Migration Script
-- Jalankan SQL ini di Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Buat tabel applicants
CREATE TABLE IF NOT EXISTS applicants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  registration_code TEXT UNIQUE NOT NULL,
  family_card_number TEXT NOT NULL CHECK (length(family_card_number) = 16),
  nik TEXT NOT NULL CHECK (length(nik) = 16),
  full_name TEXT NOT NULL,
  pisat_code INTEGER NOT NULL CHECK (pisat_code BETWEEN 1 AND 4),
  birth_place TEXT NOT NULL,
  birth_date DATE NOT NULL,
  gender INTEGER NOT NULL CHECK (gender IN (1, 2)),
  marital_status INTEGER NOT NULL CHECK (marital_status BETWEEN 0 AND 3),
  phone_number TEXT,
  email TEXT,
  address TEXT NOT NULL,
  rt TEXT,
  rw TEXT,
  postal_code TEXT,
  district TEXT NOT NULL,
  village TEXT NOT NULL,
  facility_name TEXT NOT NULL,
  ktp_url TEXT,
  kk_url TEXT,
  photo_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  card_number TEXT,
  rejection_reason TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Index untuk pencarian cepat
CREATE INDEX IF NOT EXISTS idx_applicants_nik ON applicants(nik);
CREATE INDEX IF NOT EXISTS idx_applicants_registration_code ON applicants(registration_code);
CREATE INDEX IF NOT EXISTS idx_applicants_status ON applicants(status);

-- 3. Enable Row Level Security
ALTER TABLE applicants ENABLE ROW LEVEL SECURITY;

-- 4. Policy: Allow anonymous INSERT (public registration)
CREATE POLICY "Allow public insert" ON applicants
  FOR INSERT
  WITH CHECK (true);

-- 5. Policy: Allow anonymous SELECT (public status check)
CREATE POLICY "Allow public select" ON applicants
  FOR SELECT
  USING (true);

-- 6. Policy: Allow authenticated UPDATE (admin verification)
CREATE POLICY "Allow authenticated update" ON applicants
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- 7. Policy: Allow authenticated DELETE (admin management)
CREATE POLICY "Allow authenticated delete" ON applicants
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================================
-- STORAGE BUCKET SETUP
-- Buat bucket ini secara manual di Supabase Dashboard:
-- Dashboard > Storage > New Bucket
-- Nama: applicant-documents
-- Public: ON (agar URL bisa diakses langsung)
--
-- Atau jalankan SQL berikut:
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('applicant-documents', 'applicant-documents', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Allow public upload to applicant-documents bucket
CREATE POLICY "Allow public upload" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'applicant-documents');

-- Policy: Allow public read from applicant-documents bucket
CREATE POLICY "Allow public read" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'applicant-documents');

-- Policy: Allow authenticated update to applicant-documents bucket
CREATE POLICY "Allow authenticated update storage" ON storage.objects
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Policy: Allow authenticated delete from applicant-documents bucket
CREATE POLICY "Allow authenticated delete storage" ON storage.objects
  FOR DELETE
  USING (auth.role() = 'authenticated');

