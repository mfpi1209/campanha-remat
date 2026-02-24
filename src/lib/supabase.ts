import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Campanha {
  id: string;
  situacao_financeira: 'Adimplente' | 'Inadimplente';
  descricao: string;
  created_at: string;
}

export interface Matricula {
  id?: string;
  nome: string;
  rgm: string;
  serie: number;
  situacao_financeira: 'Adimplente' | 'Inadimplente';
  valor_mensalidade: number;
  mensalidades_restantes: number;
  campanha_id: string;
  consultor?: string;
  status_rematricula?: string;
  data_rematricula?: string;
  created_at?: string;
}
