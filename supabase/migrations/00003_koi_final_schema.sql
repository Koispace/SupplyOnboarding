-- ============================================================================
-- KOI PLATFORM — Final Merged Schema Migration (00003_koi_final_schema.sql)
-- ============================================================================
-- Database: Supabase Postgres (v15+)
-- Description: Clean, unified schema incorporating 00001 and 00002 fixes.
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. ENUM DEFINITIONS
-- ============================================================================

CREATE TYPE business_type AS ENUM (
  'sole_proprietorship',
  'partnership',
  'llp',
  'private_limited',
  'public_limited',
  'opc',
  'trust',
  'other'
);

CREATE TYPE onboarding_status AS ENUM (
  'draft',
  'brand_setup_complete',
  'products_added',
  'packaging_uploaded',
  'ai_review_complete',
  'screening_complete',
  'submitted',
  'approved',
  'rejected',
  'suspended'
);

CREATE TYPE product_type AS ENUM (
  'food',
  'beverage',
  'cosmetic',
  'personal_care',
  'supplement',
  'other'
);

CREATE TYPE product_status AS ENUM (
  'draft',
  'pending_upload',
  'pending_ai_review',
  'pending_screening',
  'approved',
  'rejected',
  'delisted',
  'archived'
);

CREATE TYPE screening_verdict AS ENUM (
  'eligible',
  'review',
  'rejected'
);

CREATE TYPE upload_file_type AS ENUM (
  'front_image',
  'back_image',
  'ingredient_label',
  'nutrition_label',
  'fssai_certificate',
  'organic_certificate',
  'test_report',
  'brand_logo',
  'other_certificate'
);

CREATE TYPE contact_role AS ENUM (
  'primary',
  'finance',
  'logistics',
  'marketing',
  'founder'
);

CREATE TYPE onboarding_step AS ENUM (
  'welcome',
  'brand_setup',
  'product_basics',
  'packaging_upload',
  'ai_extraction_review',
  'screening_report',
  'final_submission'
);

CREATE TYPE audit_action AS ENUM (
  'create',
  'update',
  'delete',
  'status_change',
  'submit',
  'approve',
  'reject',
  'upload',
  'screen'
);

-- ============================================================================
-- 2. TRIGGER FUNCTIONS
-- ============================================================================

CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION trigger_set_last_saved_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_saved_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 3. TABLES
-- ============================================================================

-- --------------------------------------------------------------------------
-- 3.1 BRANDS
-- --------------------------------------------------------------------------
CREATE TABLE brands (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id            UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  brand_name          TEXT NOT NULL,
  legal_entity_name   TEXT NOT NULL,
  business_type       business_type NOT NULL DEFAULT 'private_limited',
  brand_story         TEXT,
  gstin               VARCHAR(15),
  pan                 VARCHAR(10),
  fssai_license       VARCHAR(20),
  website             TEXT,
  social_handles      JSONB DEFAULT '{}'::jsonb,
  onboarding_status   onboarding_status NOT NULL DEFAULT 'draft',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT brands_gstin_format CHECK (
    gstin IS NULL OR gstin ~ '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$'
  ),
  CONSTRAINT brands_pan_format CHECK (
    pan IS NULL OR pan ~ '^[A-Z]{5}[0-9]{4}[A-Z]{1}$'
  ),
  CONSTRAINT brands_fssai_format CHECK (
    fssai_license IS NULL OR LENGTH(fssai_license) = 14
  )
);

CREATE TRIGGER set_brands_updated_at
  BEFORE UPDATE ON brands
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- --------------------------------------------------------------------------
-- 3.2 BRAND_CONTACTS
-- --------------------------------------------------------------------------
CREATE TABLE brand_contacts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id        UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  contact_role    contact_role NOT NULL DEFAULT 'primary',
  contact_name    TEXT NOT NULL,
  designation     TEXT,
  phone           VARCHAR(15) NOT NULL,
  email           TEXT NOT NULL,
  whatsapp        VARCHAR(15),
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT brand_contacts_email_format CHECK (
    email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  ),
  CONSTRAINT brand_contacts_phone_format CHECK (
    phone ~ '^\+?[0-9]{10,15}$'
  )
);

CREATE UNIQUE INDEX uq_brand_primary_contact
  ON brand_contacts (brand_id)
  WHERE contact_role = 'primary' AND is_active = TRUE;

CREATE TRIGGER set_brand_contacts_updated_at
  BEFORE UPDATE ON brand_contacts
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- --------------------------------------------------------------------------
-- 3.3 BRAND_PAYOUT_ACCOUNTS
-- --------------------------------------------------------------------------
CREATE TABLE brand_payout_accounts (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id                UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  bank_details_encrypted  JSONB,
  payment_terms           TEXT,
  is_active               BOOLEAN NOT NULL DEFAULT TRUE,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX uq_brand_payout_active
  ON brand_payout_accounts (brand_id)
  WHERE is_active = TRUE;

CREATE TRIGGER set_brand_payout_accounts_updated_at
  BEFORE UPDATE ON brand_payout_accounts
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- --------------------------------------------------------------------------
-- 3.4 ONBOARDING_DRAFTS
-- --------------------------------------------------------------------------
CREATE TABLE onboarding_drafts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id        UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  current_step    onboarding_step NOT NULL DEFAULT 'welcome',
  payload_json    JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  last_saved_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT onboarding_drafts_payload_size CHECK (
    pg_column_size(payload_json) < 2097152
  )
);

CREATE UNIQUE INDEX uq_brand_active_draft
  ON onboarding_drafts (brand_id)
  WHERE is_active = TRUE;

CREATE TRIGGER set_onboarding_drafts_last_saved
  BEFORE UPDATE ON onboarding_drafts
  FOR EACH ROW EXECUTE FUNCTION trigger_set_last_saved_at();

-- --------------------------------------------------------------------------
-- 3.5 ONBOARDING_SESSIONS
-- --------------------------------------------------------------------------
CREATE TABLE onboarding_sessions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id        UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  status          TEXT NOT NULL DEFAULT 'draft',
  submitted_at    TIMESTAMPTZ,
  reviewed_at     TIMESTAMPTZ,
  approved_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT onboarding_sessions_status_valid CHECK (
    status IN ('draft', 'submitted', 'screening', 'review', 'approved', 'rejected')
  )
);

-- --------------------------------------------------------------------------
-- 3.6 PRODUCTS
-- --------------------------------------------------------------------------
CREATE TABLE products (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id            UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  product_name        TEXT NOT NULL,
  category_l1         TEXT NOT NULL,
  category_l2         TEXT,
  short_description   VARCHAR(300),
  long_description    TEXT,
  product_type        product_type NOT NULL DEFAULT 'food',
  status              product_status NOT NULL DEFAULT 'draft',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- --------------------------------------------------------------------------
-- 3.7 SKUS
-- --------------------------------------------------------------------------
CREATE TABLE skus (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id          UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_name        TEXT NOT NULL,
  sku_code            VARCHAR(50) NOT NULL,
  barcode_ean         VARCHAR(13),
  net_weight          VARCHAR(50),
  shelf_life_months   SMALLINT,
  mrp                 NUMERIC(10, 2) NOT NULL,
  supplier_cost_price NUMERIC(10, 2),
  moq                 INTEGER DEFAULT 1,
  units_per_case      INTEGER DEFAULT 1,
  is_active           BOOLEAN NOT NULL DEFAULT TRUE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT skus_mrp_positive CHECK (mrp > 0),
  CONSTRAINT skus_cost_positive CHECK (
    supplier_cost_price IS NULL OR supplier_cost_price > 0
  ),
  CONSTRAINT skus_moq_positive CHECK (moq > 0),
  CONSTRAINT skus_units_positive CHECK (units_per_case > 0),
  CONSTRAINT skus_shelf_life_valid CHECK (
    shelf_life_months IS NULL OR shelf_life_months > 0
  ),
  CONSTRAINT skus_barcode_format CHECK (
    barcode_ean IS NULL OR barcode_ean ~ '^[0-9]{8,13}$'
  )
);

CREATE UNIQUE INDEX uq_sku_code ON skus (sku_code);
CREATE UNIQUE INDEX uq_barcode_ean ON skus (barcode_ean) WHERE barcode_ean IS NOT NULL;

CREATE TRIGGER set_skus_updated_at
  BEFORE UPDATE ON skus
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- --------------------------------------------------------------------------
-- 3.8 SKU_NUTRITION
-- --------------------------------------------------------------------------
CREATE TABLE sku_nutrition (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku_id              UUID NOT NULL REFERENCES skus(id) ON DELETE CASCADE,
  
  -- Serving metrics
  serving_size        VARCHAR(50),
  servings_per_pack   NUMERIC(6, 1),
  measurement_basis   TEXT,
  
  -- Original label values
  energy_kcal         NUMERIC(8, 2),
  protein_g           NUMERIC(8, 2),
  carbs_g             NUMERIC(8, 2),
  sugars_g            NUMERIC(8, 2),
  added_sugar_g       NUMERIC(8, 2),
  fibre_g             NUMERIC(8, 2),
  total_fat_g         NUMERIC(8, 2),
  saturated_fat_g     NUMERIC(8, 2),
  trans_fat_g         NUMERIC(8, 2),
  sodium_mg           NUMERIC(8, 2),
  cholesterol_mg      NUMERIC(8, 2),
  potassium_mg        NUMERIC(8, 2),
  calcium_mg          NUMERIC(8, 2),
  iron_mg             NUMERIC(8, 2),
  vitamin_d_mcg       NUMERIC(8, 2),
  
  -- Normalized per-serving
  protein_per_serving NUMERIC(8, 2),
  carbs_per_serving   NUMERIC(8, 2),
  sugars_per_serving  NUMERIC(8, 2),
  fibre_per_serving   NUMERIC(8, 2),
  fat_per_serving     NUMERIC(8, 2),
  kcal_per_serving    NUMERIC(8, 2),
  
  -- Normalized per-100g
  protein_per_100g    NUMERIC(8, 2),
  carbs_per_100g      NUMERIC(8, 2),
  sugars_per_100g     NUMERIC(8, 2),
  fibre_per_100g      NUMERIC(8, 2),
  fat_per_100g        NUMERIC(8, 2),
  kcal_per_100g       NUMERIC(8, 2),

  -- AI Extraction metadata
  is_ai_extracted     BOOLEAN DEFAULT FALSE,
  ai_confidence       NUMERIC(3, 2),
  manually_verified   BOOLEAN DEFAULT FALSE,
  
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT sku_nutrition_measurement_basis_valid CHECK (
    measurement_basis IS NULL OR measurement_basis IN ('per_serving', 'per_100g', 'per_100ml')
  ),
  CONSTRAINT sku_nutrition_energy_valid CHECK (energy_kcal IS NULL OR energy_kcal >= 0),
  CONSTRAINT sku_nutrition_protein_valid CHECK (protein_g IS NULL OR protein_g >= 0),
  CONSTRAINT sku_nutrition_fat_valid CHECK (total_fat_g IS NULL OR total_fat_g >= 0),
  CONSTRAINT sku_nutrition_sodium_valid CHECK (sodium_mg IS NULL OR sodium_mg >= 0),
  CONSTRAINT sku_nutrition_confidence_range CHECK (
    ai_confidence IS NULL OR (ai_confidence >= 0 AND ai_confidence <= 1)
  )
);

CREATE UNIQUE INDEX uq_sku_nutrition ON sku_nutrition (sku_id);

CREATE TRIGGER set_sku_nutrition_updated_at
  BEFORE UPDATE ON sku_nutrition
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- --------------------------------------------------------------------------
-- 3.9 SKU_INGREDIENTS
-- --------------------------------------------------------------------------
CREATE TABLE sku_ingredients (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku_id              UUID NOT NULL REFERENCES skus(id) ON DELETE CASCADE,
  
  raw_ingredient_text TEXT,
  parsed_ingredients  JSONB DEFAULT '[]'::jsonb,
  additive_codes      JSONB DEFAULT '[]'::jsonb,
  allergens           JSONB DEFAULT '[]'::jsonb,
  
  is_ai_extracted     BOOLEAN DEFAULT FALSE,
  ai_confidence       NUMERIC(3, 2),
  manually_verified   BOOLEAN DEFAULT FALSE,
  
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT sku_ingredients_confidence_range CHECK (
    ai_confidence IS NULL OR (ai_confidence >= 0 AND ai_confidence <= 1)
  )
);

CREATE UNIQUE INDEX uq_sku_ingredients ON sku_ingredients (sku_id);

CREATE TRIGGER set_sku_ingredients_updated_at
  BEFORE UPDATE ON sku_ingredients
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- --------------------------------------------------------------------------
-- 3.10 INGREDIENTS_MASTER
-- --------------------------------------------------------------------------
CREATE TABLE ingredients_master (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  canonical_name      TEXT UNIQUE NOT NULL,
  aliases             JSONB DEFAULT '[]'::jsonb,
  ingredient_category TEXT,
  risk_level          TEXT,
  is_blocked          BOOLEAN DEFAULT FALSE,
  notes               TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT ingredients_master_risk_level_valid CHECK (
    risk_level IS NULL OR risk_level IN ('safe', 'caution', 'risky', 'blocked')
  )
);

CREATE TRIGGER set_ingredients_master_updated_at
  BEFORE UPDATE ON ingredients_master
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- --------------------------------------------------------------------------
-- 3.11 SCREENING_REPORTS
-- --------------------------------------------------------------------------
CREATE TABLE screening_reports (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku_id              UUID NOT NULL REFERENCES skus(id) ON DELETE CASCADE,
  
  ingredient_score    NUMERIC(5, 2),
  nutrition_score     NUMERIC(5, 2),
  processing_score    NUMERIC(5, 2),
  final_score         NUMERIC(5, 2),
  verdict             screening_verdict NOT NULL DEFAULT 'review',
  flags               JSONB DEFAULT '[]'::jsonb,
  
  reviewed_by         UUID REFERENCES auth.users(id),
  reviewed_at         TIMESTAMPTZ,
  review_notes        TEXT,
  version             INTEGER NOT NULL DEFAULT 1,
  is_latest           BOOLEAN NOT NULL DEFAULT TRUE,
  
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT screening_score_range CHECK (
    (ingredient_score IS NULL OR (ingredient_score >= 0 AND ingredient_score <= 100)) AND
    (nutrition_score IS NULL OR (nutrition_score >= 0 AND nutrition_score <= 100)) AND
    (processing_score IS NULL OR (processing_score >= 0 AND processing_score <= 100)) AND
    (final_score IS NULL OR (final_score >= 0 AND final_score <= 100))
  ),
  CONSTRAINT screening_review_consistency CHECK (
    (reviewed_by IS NULL AND reviewed_at IS NULL) OR
    (reviewed_by IS NOT NULL AND reviewed_at IS NOT NULL)
  )
);

CREATE UNIQUE INDEX uq_sku_latest_screening ON screening_reports (sku_id) WHERE is_latest = TRUE;

-- --------------------------------------------------------------------------
-- 3.12 UPLOADS
-- --------------------------------------------------------------------------
CREATE TABLE uploads (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id            UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  product_id          UUID REFERENCES products(id) ON DELETE SET NULL,
  sku_id              UUID REFERENCES skus(id) ON DELETE SET NULL,
  
  bucket_name         TEXT NOT NULL,
  file_type           upload_file_type NOT NULL,
  file_name           TEXT NOT NULL,
  mime_type           VARCHAR(100),
  file_size_bytes     BIGINT,
  storage_path        TEXT NOT NULL,
  public_url          TEXT,
  
  uploaded_by         UUID REFERENCES auth.users(id),
  uploaded_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_deleted          BOOLEAN NOT NULL DEFAULT FALSE,
  deleted_at          TIMESTAMPTZ,

  CONSTRAINT uploads_file_size_valid CHECK (
    file_size_bytes IS NULL OR file_size_bytes > 0
  ),
  CONSTRAINT uploads_storage_path_not_empty CHECK (
    LENGTH(TRIM(storage_path)) > 0
  )
);

-- --------------------------------------------------------------------------
-- 3.13 AI_EXTRACTION_JOBS
-- --------------------------------------------------------------------------
CREATE TABLE ai_extraction_jobs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  upload_id       UUID NOT NULL REFERENCES uploads(id) ON DELETE CASCADE,
  status          TEXT NOT NULL DEFAULT 'pending',
  provider        TEXT,
  raw_response    JSONB,
  error_message   TEXT,
  started_at      TIMESTAMPTZ,
  completed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT ai_extraction_jobs_status_valid CHECK (
    status IN ('pending', 'processing', 'completed', 'failed')
  )
);

-- --------------------------------------------------------------------------
-- 3.14 INVENTORY
-- --------------------------------------------------------------------------
CREATE TABLE inventory (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku_id          UUID NOT NULL REFERENCES skus(id) ON DELETE CASCADE,
  location_name   TEXT NOT NULL,
  stock_on_hand   INTEGER NOT NULL DEFAULT 0,
  reserved_qty    INTEGER NOT NULL DEFAULT 0,
  reorder_level   INTEGER NOT NULL DEFAULT 0,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT inventory_stock_non_negative CHECK (stock_on_hand >= 0),
  CONSTRAINT inventory_reserved_non_negative CHECK (reserved_qty >= 0),
  CONSTRAINT inventory_reorder_non_negative CHECK (reorder_level >= 0)
);

CREATE UNIQUE INDEX uq_inventory_sku_location ON inventory (sku_id, location_name);

CREATE TRIGGER set_inventory_updated_at
  BEFORE UPDATE ON inventory
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- --------------------------------------------------------------------------
-- 3.15 AUDIT_LOGS
-- --------------------------------------------------------------------------
CREATE TABLE audit_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type     TEXT NOT NULL,
  entity_id       UUID NOT NULL,
  action          audit_action NOT NULL,
  changed_by      UUID REFERENCES auth.users(id),
  old_data        JSONB,
  new_data        JSONB,
  metadata        JSONB,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 4. INDEXES
-- ============================================================================

-- brands
CREATE INDEX idx_brands_owner ON brands (owner_id);
CREATE INDEX idx_brands_status ON brands (onboarding_status);
CREATE INDEX idx_brands_name ON brands (brand_name);
CREATE INDEX idx_brands_created ON brands (created_at DESC);

-- brand_contacts
CREATE INDEX idx_brand_contacts_brand ON brand_contacts (brand_id);

-- brand_payout_accounts
CREATE INDEX idx_brand_payouts_brand ON brand_payout_accounts (brand_id);

-- onboarding_drafts
CREATE INDEX idx_drafts_brand ON onboarding_drafts (brand_id);

-- onboarding_sessions
CREATE INDEX idx_onboarding_sessions_brand_status ON onboarding_sessions (brand_id, status);
CREATE INDEX idx_onboarding_sessions_status ON onboarding_sessions (status);

-- products
CREATE INDEX idx_products_brand ON products (brand_id);
CREATE INDEX idx_products_status ON products (status);
CREATE INDEX idx_products_category ON products (category_l1, category_l2);
CREATE INDEX idx_products_type ON products (product_type);
CREATE INDEX idx_products_brand_status ON products (brand_id, status);

-- skus
CREATE INDEX idx_skus_product ON skus (product_id);
CREATE INDEX idx_skus_active ON skus (product_id) WHERE is_active = TRUE;

-- ingredients_master
CREATE INDEX idx_ingredients_master_aliases ON ingredients_master USING GIN (aliases);
CREATE INDEX idx_ingredients_master_risk ON ingredients_master (risk_level);
CREATE INDEX idx_ingredients_master_blocked ON ingredients_master (is_blocked) WHERE is_blocked = TRUE;

-- screening_reports
CREATE INDEX idx_screening_sku ON screening_reports (sku_id);
CREATE INDEX idx_screening_verdict ON screening_reports (verdict) WHERE is_latest = TRUE;
CREATE INDEX idx_screening_reviewer ON screening_reports (reviewed_by);
CREATE INDEX idx_screening_pending ON screening_reports (sku_id) WHERE verdict = 'review' AND is_latest = TRUE;

-- uploads
CREATE INDEX idx_uploads_brand ON uploads (brand_id);
CREATE INDEX idx_uploads_product ON uploads (product_id) WHERE product_id IS NOT NULL;
CREATE INDEX idx_uploads_sku ON uploads (sku_id) WHERE sku_id IS NOT NULL;
CREATE INDEX idx_uploads_type ON uploads (file_type);
CREATE INDEX idx_uploads_active ON uploads (brand_id, file_type) WHERE is_deleted = FALSE;

-- ai_extraction_jobs
CREATE INDEX idx_ai_jobs_upload_status ON ai_extraction_jobs (upload_id, status);
CREATE INDEX idx_ai_jobs_status ON ai_extraction_jobs (status);
CREATE INDEX idx_ai_jobs_created ON ai_extraction_jobs (created_at DESC);

-- inventory
CREATE INDEX idx_inventory_sku ON inventory (sku_id);
CREATE INDEX idx_inventory_location ON inventory (location_name);

-- audit_logs
CREATE INDEX idx_audit_entity ON audit_logs (entity_type, entity_id);
CREATE INDEX idx_audit_user ON audit_logs (changed_by);
CREATE INDEX idx_audit_created ON audit_logs (created_at DESC);
CREATE INDEX idx_audit_action ON audit_logs (action);
CREATE INDEX idx_audit_entity_time ON audit_logs (entity_type, entity_id, created_at DESC);
