import { getSupabaseClient } from '../supabase/client'
import { getMockAIExtractionResult } from '../mocks/aiExtractionMock'

/**
 * Step 1: Create a draft product immediately.
 * @param {string} brandId
 * @param {object} basicInfo - { name, category, shortDescription, longDescription, claims }
 * @returns {string} productId
 */
export async function createDraftProduct(brandId, basicInfo) {
  const supabase = getSupabaseClient()

  // Serialize claims into long_description to avoid schema changes
  const descriptionPayload = JSON.stringify({
    text: basicInfo.longDescription || '',
    claims: basicInfo.claims || []
  })

  const { data, error } = await supabase
    .from('products')
    .insert({
      brand_id: brandId,
      product_name: basicInfo.name,
      category_l1: basicInfo.category,
      short_description: basicInfo.shortDescription,
      long_description: descriptionPayload,
      status: 'draft'
    })
    .select('id')
    .single()

  if (error) {
    console.error('Failed to create draft product:', error)
    throw error
  }
  return data.id
}

export async function createSkus(productId, skus) {
  const supabase = getSupabaseClient()
  
  const payload = skus.map(sku => ({
    product_id: productId,
    variant_name: sku.skuName || sku.variant || 'Default Variant',
    sku_code: sku.skuCode,
    barcode_ean: sku.barcode && sku.barcode.trim() !== '' ? sku.barcode.trim() : null,
    net_weight: sku.size || null,
    mrp: parseFloat(sku.mrp),
    supplier_cost_price: sku.supplierCost ? parseFloat(sku.supplierCost) : null,
    is_active: true
  }))

  const { data, error } = await supabase
    .from('skus')
    .insert(payload)
    .select()

  if (error) {
    console.error('Failed to insert SKUs:', error)
    throw error
  }

  return data
}

/**
 * Handle SKU Upserts
 * Matches on sku_code
 */
export async function upsertSkus(productId, skusList) {
  const supabase = getSupabaseClient()
  
  const skusPayload = skusList.map(s => ({
    ...(s.id ? { id: s.id } : {}), // only include id if updating
    product_id: productId,
    variant_name: s.name,
    sku_code: s.code,
    net_weight: s.volume,
    barcode_ean: s.barcode || null,
    mrp: parseFloat(s.mrp),
    supplier_cost_price: s.cost ? parseFloat(s.cost) : null,
    selling_price: s.sellingPrice ? parseFloat(s.sellingPrice) : null,
    is_active: true
  }))

  const { data, error } = await supabase
    .from('skus')
    .upsert(skusPayload, { onConflict: 'id' })
    .select('id, sku_code')

  if (error) {
    console.error('Failed to upsert SKUs:', error)
    throw error
  }
  return data
}

/**
 * Step 3 & 4: Upload label files to Supabase storage and create upload records.
 * @param {string} brandId
 * @param {string} productId
 * @param {string} skuId
 * @param {object} files - { nutritionLabel: File, ingredientLabel: File, frontPackaging: File }
 */
export async function uploadLabels(brandId, productId, skuId, files) {
  const supabase = getSupabaseClient()
  const uploadRecords = []

  const fileEntries = Object.entries(files).filter(([_, file]) => file !== null)

  for (const [key, file] of fileEntries) {
    // Map object keys to DB enum values
    const fileTypeMap = {
      nutritionLabel: 'nutrition_label',
      ingredientLabel: 'ingredient_label',
      frontPackaging: 'front_image',
      labReport: 'test_report',
      certification: 'organic_certificate',
      clinicalStudy: 'other_certificate'
    }

    const dbFileType = fileTypeMap[key] || 'other_certificate'
    
    // Upload to storage bucket 'documents' (assuming this is standard based on previous mocks)
    const filePath = `brands/${brandId}/products/${productId}/${skuId}/${Date.now()}_${file.name}`
    
    // In a real browser environment, we upload the actual File object.
    const { data: storageData, error: storageError } = await supabase.storage
      .from('documents')
      .upload(filePath, file)

    if (storageError) {
      console.error(`Failed to upload file ${file.name}:`, storageError)
      throw storageError
    }

    // Create DB record
    const { data: uploadRecord, error: dbError } = await supabase
      .from('uploads')
      .insert({
        brand_id: brandId,
        product_id: productId,
        sku_id: skuId,
        bucket_name: 'documents',
        file_type: dbFileType,
        file_name: file.name,
        mime_type: file.type,
        file_size_bytes: file.size,
        storage_path: storageData.path,
        is_deleted: false
      })
      .select('id')
      .single()

    if (dbError) throw dbError
    
    uploadRecords.push({ id: uploadRecord.id, type: key })
  }

  return uploadRecords
}

/**
 * Step 5: Trigger Mock AI Extraction
 * @param {string} productId
 * @param {string} uploadId - Optional, the primary upload ID driving extraction
 * @returns {object} The parsed AI extraction result
 */
export async function triggerAIPipeline(productId, uploadId = null) {
  const supabase = getSupabaseClient()

  // Update status
  await supabase
    .from('products')
    .update({ status: 'ai_processing' })
    .eq('id', productId)

  // Simulate network delay for AI processing
  await new Promise(resolve => setTimeout(resolve, 3000))

  const aiMock = getMockAIExtractionResult()

  // In a real environment, we'd fetch the SKUs, but we'll assume there's at least one to attach the report to
  const { data: skus } = await supabase
    .from('skus')
    .select('id')
    .eq('product_id', productId)
    .limit(1)

  if (skus && skus.length > 0) {
    const skuId = skus[0].id

    // Create a mock screening report to complete the pipeline
    await supabase
      .from('screening_reports')
      .insert({
        sku_id: skuId,
        ingredient_score: aiMock.healthScore,
        nutrition_score: aiMock.healthScore,
        processing_score: aiMock.healthScore,
        final_score: aiMock.healthScore,
        verdict: 'review',
        flags: aiMock.flags,
        is_latest: true
      })
  }

  return aiMock
}

/**
 * Submit for Final Review
 */
export async function submitProductForReview(productId) {
  const supabase = getSupabaseClient()
  
  const { error } = await supabase
    .from('products')
    .update({ status: 'under_review' })
    .eq('id', productId)
    
  if (error) throw error
  return true
}
