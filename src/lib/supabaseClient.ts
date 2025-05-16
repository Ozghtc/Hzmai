import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bwvlhwbqdrgqyeathvko.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3dmxod2JxZHJncXllYXRodmtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczMzA3NTMsImV4cCI6MjA2MjkwNjc1M30.uyS7qnlQ1oRBqiysvC1pIdOvKkwklruQfxb9opGB_tM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 