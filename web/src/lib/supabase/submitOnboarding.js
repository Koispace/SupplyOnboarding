import { getSupabaseClient } from './client'
import { uploadFileToSupabase } from './storage'
import { useOnboardingStore } from '@/store/onboardingStore'

/**
 * Upload all files and submit the onboarding payload
 * @returns {{ success: boolean, error?: string }}
 */
export async function submitOnboarding() {
  const supabase = getSupabaseClient()
  const state = useOnboardingStore.getState()
  
  // Clone data to avoid mutating store state with URLs directly before success
  let pData = { ...state.productData, skus: [...state.productData.skus] }
  let cData = { ...state.complianceData }

  try {
    // 1. Upload Product Catalog
    if (pData.catalogFile instanceof File) {
      const { url, error } = await uploadFileToSupabase(pData.catalogFile, 'onboarding-documents', 'catalog')
      if (error) throw new Error(`Catalog upload failed: ${error}`)
      pData.catalogFile = url
    }

    // 2. Upload SKUs Nutrition and Ingredients
    for (let i = 0; i < pData.skus.length; i++) {
      const sku = { ...pData.skus[i] }
      
      if (sku.nutritionFile instanceof File) {
        const { url, error } = await uploadFileToSupabase(sku.nutritionFile, 'product-labels', 'nutrition')
        if (error) throw new Error(`SKU ${i+1} nutrition upload failed: ${error}`)
        sku.nutritionFile = url
      }
      if (sku.ingredientFile instanceof File) {
        const { url, error } = await uploadFileToSupabase(sku.ingredientFile, 'product-labels', 'ingredients')
        if (error) throw new Error(`SKU ${i+1} ingredient upload failed: ${error}`)
        sku.ingredientFile = url
      }
      pData.skus[i] = sku
    }

    // 3. Upload Compliance Files (FSSAI)
    if (cData.fssaiFile instanceof File) {
      const { url, error } = await uploadFileToSupabase(cData.fssaiFile, 'certifications', 'fssai')
      if (error) throw new Error(`FSSAI upload failed: ${error}`)
      cData.fssaiFile = url
    }

    // 4. Upload Organic Files (array)
    const organicUrls = []
    for (const f of cData.organicFiles) {
      if (f instanceof File) {
        const { url, error } = await uploadFileToSupabase(f, 'certifications', 'organic')
        if (error) throw new Error(`Organic file upload failed: ${error}`)
        organicUrls.push(url)
      } else {
        organicUrls.push(f)
      }
    }
    cData.organicFiles = organicUrls

    // 5. Upload Scientific Files (array)
    const scientificUrls = []
    for (const f of cData.scientificEvidenceFiles) {
      if (f instanceof File) {
        const { url, error } = await uploadFileToSupabase(f, 'certifications', 'research')
        if (error) throw new Error(`Scientific evidence upload failed: ${error}`)
        scientificUrls.push(url)
      } else {
        scientificUrls.push(f)
      }
    }
    cData.scientificEvidenceFiles = scientificUrls

    // Update store with these URLs so user doesn't lose them if something fails later
    state.updateProductData(pData)
    state.updateComplianceData(cData)

    // 6. Upsert into database
    const payload = {
      brand_data: state.brandData,
      product_data: pData,
      compliance_data: cData,
      status: 'submitted',
      submitted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    let dbError
    if (state.draftId) {
      const { error } = await supabase
        .from('onboarding_submissions')
        .update(payload)
        .eq('id', state.draftId)
      dbError = error
    } else {
      const { data, error } = await supabase
        .from('onboarding_submissions')
        .insert({
          ...payload,
          brand_id: crypto.randomUUID(), // Temp uuid
        })
        .select('id')
        .single()
      
      dbError = error
      if (data?.id) state.setField('draftId', data.id)
    }

    if (dbError) throw new Error(`Database save failed: ${dbError.message}`)

    // Update store status to submitted
    state.setField('status', 'submitted')

    if (typeof window !== 'undefined') {
      localStorage.removeItem('koi_onboarding_draft_id')
    }

    return { success: true }
  } catch (err) {
    console.error('[submitOnboarding] Error:', err)
    return { success: false, error: err.message }
  }
}
