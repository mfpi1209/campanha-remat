/*
  # Criar tabela de consultores

  1. Nova Tabela
    - `consultores`
      - `id` (uuid, primary key)
      - `nome` (text, nome do consultor)
      - `created_at` (timestamp)
  
  2. Segurança
    - Habilita RLS na tabela `consultores`
    - Adiciona política para leitura pública (qualquer usuário autenticado pode visualizar)
  
  3. Dados Iniciais
    - Insere 11 consultores na tabela
*/

CREATE TABLE IF NOT EXISTS consultores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE consultores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Consultores podem ser lidos por todos"
  ON consultores
  FOR SELECT
  TO authenticated
  USING (true);

INSERT INTO consultores (nome) VALUES
  ('Beatriz'),
  ('Camila Ferreira'),
  ('Camila Ferreira Santos'),
  ('Danubia'),
  ('Debora'),
  ('Emanuel'),
  ('Joyce'),
  ('Julia'),
  ('Mariana'),
  ('Marília'),
  ('Wesley')
ON CONFLICT DO NOTHING;
