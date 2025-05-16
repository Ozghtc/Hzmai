import { supabase } from '../lib/supabaseClient';

// Eğitim ekle
export async function addTraining({ title, site_url }) {
  const { data, error } = await supabase
    .from('trainings')
    .insert([{ title, site_url }]);
  return { data, error };
}

// Eğitimleri listele
export async function fetchTrainings() {
  const { data, error } = await supabase
    .from('trainings')
    .select('*')
    .order('created_at', { ascending: true });
  return { data, error };
} 