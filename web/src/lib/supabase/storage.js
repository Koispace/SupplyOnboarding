import { getSupabaseClient } from './client'

/**
 * Upload a file to a specific Supabase storage bucket and folder.
 * 
 * @param {File} file - The file object to upload
 * @param {string} bucket - The name of the storage bucket
 * @param {string} folder - The folder path inside the bucket (e.g., "catalog", "nutrition")
 * @returns {Promise<{ url: string | null, error: string | null }>}
 */
export async function uploadFileToSupabase(file, bucket, folder) {
  if (!file) return { url: null, error: 'No file provided' }

  const supabase = getSupabaseClient()
  
  // Create a unique file name to prevent overwrites
  const fileExtension = file.name.split('.').pop()
  const uniqueId = crypto.randomUUID()
  const filePath = `${folder}/${uniqueId}.${fileExtension}`

  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error(`[uploadFileToSupabase] Error uploading to ${bucket}/${folder}:`, error.message)
      return { url: null, error: error.message }
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)

    return { url: publicUrlData.publicUrl, error: null }
  } catch (err) {
    console.error(`[uploadFileToSupabase] Unexpected error:`, err)
    return { url: null, error: err.message }
  }
}
