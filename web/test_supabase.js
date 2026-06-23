import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://pczfoxqxkclrodzkfjpo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjemZveHF4a2Nscm9kemtmanBvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2MzAyMzMsImV4cCI6MjA5NzIwNjIzM30.-2WEqptUBWi7oC0qS-PnuUejudrwOElpz-1sWCedRag'
)

async function test() {
  console.log('Fetching first brand...')
  const { data: brands, error: bErr } = await supabase.from('brands').select('id').limit(1)
  if (bErr) {
    console.error('Fetch brand error:', bErr)
    return
  }
  
  if (!brands || brands.length === 0) {
    console.log('No brands found!')
    return
  }
  
  const brandId = brands[0].id
  console.log('Found brand:', brandId)
  
  console.log('Attempting insert...')
  const { data, error } = await supabase.from('products').insert({
    brand_id: brandId,
    product_name: 'Test Product',
    category_l1: 'protein_powder',
    short_description: 'Test',
    long_description: '{}',
    status: 'draft'
  }).select('id').single()
  
  if (error) {
    console.error('Insert error properties:', Object.keys(error))
    console.error('Insert error message:', error.message)
    console.error('Insert error code:', error.code)
    console.error('Insert error details:', error.details)
    console.error('Insert error hint:', error.hint)
    return
  }
  
  console.log('Success, created product:', data.id)
  
  // Cleanup
  await supabase.from('products').delete().eq('id', data.id)
  console.log('Cleaned up product.')
}

test()
