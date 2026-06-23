-- ============================================================================
-- KOI PLATFORM — Dashboard Products Refinements (00005_dashboard_products_v3.sql)
-- ============================================================================

-- ============================================================================
-- TASK 1 — UPDATE PRODUCT_STATUS ENUM
-- ============================================================================
-- We add the required new statuses. 
-- Existing: 'draft', 'pending_upload', 'pending_ai_review', 'pending_screening', 'approved', 'rejected', 'delisted', 'archived'
-- Requested: 'draft', 'under_review', 'ai_processing', 'approved', 'live', 'paused', 'rejected', 'archived'

ALTER TYPE product_status ADD VALUE IF NOT EXISTS 'under_review';
ALTER TYPE product_status ADD VALUE IF NOT EXISTS 'ai_processing';
ALTER TYPE product_status ADD VALUE IF NOT EXISTS 'live';
ALTER TYPE product_status ADD VALUE IF NOT EXISTS 'paused';

-- ============================================================================
-- TASK 2 — CREATE DASHBOARD PRODUCTS VIEW
-- ============================================================================
-- Purpose: Avoid row multiplication from raw multi-table joins and return a cleanly aggregated object.

CREATE OR REPLACE VIEW dashboard_products_view AS
SELECT 
    p.id,
    p.product_name AS "productName",
    p.category_l1 AS category,
    p.status,
    p.created_at,
    COUNT(DISTINCT s.id) AS "skuCount",
    COALESCE(SUM(i.stock_on_hand - i.reserved_qty), 0) AS "totalStock",
    (
        SELECT sr.final_score 
        FROM screening_reports sr 
        JOIN skus inner_s ON inner_s.id = sr.sku_id 
        WHERE inner_s.product_id = p.id AND sr.is_latest = true
        ORDER BY sr.created_at DESC 
        LIMIT 1
    ) AS "healthScore"
FROM products p
LEFT JOIN skus s ON p.id = s.product_id AND s.is_active = true
LEFT JOIN inventory i ON s.id = i.sku_id
GROUP BY p.id, p.product_name, p.category_l1, p.status, p.created_at;

