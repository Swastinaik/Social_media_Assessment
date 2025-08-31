
import { createClient } from '@supabase/supabase-js'

const supabase_url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const service_role_key = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function isAdmin() {
  const supabase = createClient(supabase_url, service_role_key, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})
  const adminAuthClient = supabase.auth.admin
  return adminAuthClient ? adminAuthClient : null
}
  




// Access auth admin api
