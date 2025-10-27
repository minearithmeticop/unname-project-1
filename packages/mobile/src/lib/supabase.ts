import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

// Validate environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file.\n' +
    'Required variables:\n' +
    '  - EXPO_PUBLIC_SUPABASE_URL\n' +
    '  - EXPO_PUBLIC_SUPABASE_ANON_KEY\n\n' +
    'Copy .env.example to .env and fill in your values from:\n' +
    'https://supabase.com/dashboard/project/_/settings/api'
  )
}

// Validate HTTPS
if (!supabaseUrl.startsWith('https://')) {
  throw new Error('Supabase URL must use HTTPS for security')
}

/**
 * Supabase Client Configuration
 * 
 * Security Notes:
 * - Uses AsyncStorage for session persistence
 * - Auto-refreshes authentication tokens
 * - Only use anon key (never service_role key in client)
 * - Requires Row Level Security (RLS) enabled on tables
 * 
 * @see docs/SECURITY.md for security best practices
 * @see docs/API_INTEGRATION.md for setup guide
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

/**
 * Type-safe database types (optional)
 * Generate using: npx supabase gen types typescript --project-id YOUR_PROJECT_ID
 */
export type Database = {
  public: {
    Tables: {
      // Define your table types here
      // Example:
      // users: {
      //   Row: {
      //     id: string
      //     email: string
      //     created_at: string
      //   }
      //   Insert: {
      //     id?: string
      //     email: string
      //     created_at?: string
      //   }
      //   Update: {
      //     email?: string
      //   }
      // }
    }
  }
}
