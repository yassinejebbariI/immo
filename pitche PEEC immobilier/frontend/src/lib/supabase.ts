import { createClient } from '@supabase/supabase-js';

// @ts-ignore
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// @ts-ignore
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type User = {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'agency' | 'client';
  agency_id?: string;
};

export type Agency = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
};

export type Property = {
  id: string;
  agency_id: string;
  title: string;
  description?: string;
  type: 'apartment' | 'house' | 'commercial';
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area?: number;
  image_url?: string;
};

export type Visit = {
  id: string;
  property_id: string;
  client_id: string;
  scheduled_at: string;
  status: 'pending' | 'confirmed' | 'completed';
};
