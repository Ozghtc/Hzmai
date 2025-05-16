import { supabase } from '../lib/supabaseClient';

// Mesaj ekle
export async function addMessage({ text, sender, chat_id }) {
  const { data, error } = await supabase
    .from('messages')
    .insert([{ text, sender, chat_id }]);
  return { data, error };
}

// Mesajları listele
export async function fetchMessages(chat_id) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('chat_id', chat_id)
    .order('created_at', { ascending: true });
  return { data, error };
} 