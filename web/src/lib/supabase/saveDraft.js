import { getSupabaseClient } from './client'
import { uploadFileToSupabase } from './storage'
import { useOnboardingStore } from '@/store/onboardingStore'

/**
 * Handle "Save Draft" functionality for onboarding
 * 
 * Upserts the current store state into `onboarding_submissions` with status 'draft'.
 */
export async function saveDraftToSupabase() {
  const supabase = getSupabaseClient()
  const state = useOnboardingStore.getState()
  
  const payload = {
    brand_data: state.brandData,
    product_data: state.productData,
    compliance_data: state.complianceData,
    status: 'draft',
    updated_at: new Date().toISOString(),
  }

  // If there's an existing draftId, we update, else insert
  try {
    let result
    if (state.draftId) {
      result = await supabase
        .from('onboarding_submissions')
        .update(payload)
        .eq('id', state.draftId)
        .select('id')
        .single()
    } else {
      result = await supabase
        .from('onboarding_submissions')
        .insert({
          ...payload,
          brand_id: crypto.randomUUID(), // In reality, fetch from auth.user()
        })
        .select('id')
        .single()
    }

    if (result.error) {
      console.error('[saveDraftToSupabase] DB Error:', result.error)
      return { success: false, error: result.error.message }
    }

    // Update store with draftId
    useOnboardingStore.getState().setField('draftId', result.data.id)
    if (typeof window !== 'undefined') {
      localStorage.setItem('koi_onboarding_draft_id', result.data.id)
    }
    return { success: true, draftId: result.data.id }
  } catch (err) {
    console.error('[saveDraftToSupabase] Unexpected error:', err)
    return { success: false, error: err.message }
  }
}
