import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://uunqqpqyehxjodvozlgu.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1bnFxcHF5ZWh4am9kdm96bGd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxMzkxNDYsImV4cCI6MjA5MDcxNTE0Nn0.rWMkjHIP0liEe3eVI_044C-5naheXS43M4ejqb1J7eU';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
