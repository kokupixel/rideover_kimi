import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          phone: string;
          avatar_url: string | null;
          role: 'rider' | 'driver' | 'admin';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      rides: {
        Row: {
          id: string;
          rider_id: string;
          driver_id: string | null;
          pickup_location: {
            latitude: number;
            longitude: number;
            address: string;
          };
          dropoff_location: {
            latitude: number;
            longitude: number;
            address: string;
          };
          status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
          fare: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['rides']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['rides']['Insert']>;
      };
    };
  };
};
