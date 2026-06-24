import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pczfoxqxkclrodzkfjpo.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function check() {
  const { data, error } = await supabase.from('brands').select('owner_id').limit(1);
  if (error) {
    console.error("Error:", error);
    return;
  }
  console.log("Brands:", data);
}

check();
