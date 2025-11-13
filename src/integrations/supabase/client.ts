import { createClient } from '@supabase/supabase-js';

// 1. Lemos as variáveis de ambiente do Vite
// Elas DEVEM começar com VITE_ para serem acessíveis no navegador
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 2. Verificação de segurança (Recomendado)
// Isso garante que o app "quebre" claramente se as variáveis não estiverem definidas.
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Credenciais do Supabase não encontradas. Verifique suas variáveis de ambiente.");
}

// 3. Criamos o cliente com as variáveis
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false, // Não precisamos de sessão pois é acesso público
  },
});