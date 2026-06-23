import { getSupabaseClient } from '../supabase/client'

/**
 * Fetch a list of products with their related SKUs, inventory, and screening reports.
 */
export async function getProducts(filters = {}) {
  const supabase = getSupabaseClient()

  let query = supabase
    .from('dashboard_products_view')
    .select('*')
    .order('created_at', { ascending: false })

  // Apply filters if needed
  if (filters.search) {
    query = query.ilike('productName', `%${filters.search}%`)
  }
  if (filters.status) {
    query = query.eq('status', filters.status)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching products view:', error)
    throw error
  }

  // The view returns normalized product objects natively:
  // { id, productName, category, status, created_at, skuCount, totalStock, healthScore }
  return data.map((product) => ({
    id: product.id,
    name: product.productName,
    category: product.category,
    status: product.status,
    skuCount: Number(product.skuCount) || 0,
    stock: Number(product.totalStock) || 0,
    healthScore: product.healthScore,
    createdAt: product.created_at,
  }))
}

export async function getProductStats() {
  const supabase = getSupabaseClient()

  // Total products
  const { count: totalProducts, error: err1 } = await supabase
    .from('products')
    .select('id', { count: 'exact', head: true })

  // Live products
  const { count: liveProducts, error: err2 } = await supabase
    .from('products')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'live')

  // Under review
  const { count: underReview, error: err3 } = await supabase
    .from('products')
    .select('id', { count: 'exact', head: true })
    .in('status', ['under_review', 'ai_processing'])

  // Risk Alerts (health score < 80)
  const { count: riskAlerts, error: err4 } = await supabase
    .from('dashboard_products_view')
    .select('id', { count: 'exact', head: true })
    .lt('healthScore', 80)

  if (err1 || err2 || err3 || err4) {
    console.error('Error fetching product stats', { err1, err2, err3, err4 })
    throw err1 || err2 || err3 || err4
  }

  return {
    totalProducts: totalProducts || 0,
    liveProducts: liveProducts || 0,
    underReview: underReview || 0,
    riskAlerts: riskAlerts || 0,
  }
}
