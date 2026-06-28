require('dotenv').config({ path: './.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function test() {
    console.log("Fetching product_status enum values...");
    const { data, error } = await supabase
        .rpc('get_enum_values', { enum_name: 'product_status' }); // if such an RPC exists
        
    // Alternatively, just trigger a bad enum value and catch the hint
    const { error: err } = await supabase
        .from('products')
        .select('id')
        .eq('status', 'INVALID_STATUS');
    
    console.log("Error from Postgres:", err);
}

test();
