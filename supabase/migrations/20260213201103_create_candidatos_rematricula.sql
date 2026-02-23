/*
  # Create candidatos_rematricula table

  New table to store candidate data from CSV uploads.
  
  1. New Tables
    - `candidatos_rematricula`
      - `id` (uuid, primary key)
      - `polo` (text) - Campus/Polo name
      - `nome` (text) - Student name
      - `telefone` (text) - Phone number
      - `email` (text) - Email address
      - `rgm` (text) - Student RGM (unique)
      - `serie` (integer) - Course series
      - `curso` (text) - Course name
      - `apto_rematricula` (boolean) - Eligible for rematrícula
      - `situacao_financeira` (text) - Financial status
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on candidatos table
    - Add policies for public read/write access
*/

CREATE TABLE IF NOT EXISTS candidatos_rematricula (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  polo text NOT NULL,
  nome text NOT NULL,
  telefone text NOT NULL,
  email text NOT NULL,
  rgm text NOT NULL UNIQUE,
  serie integer NOT NULL CHECK (serie >= 1 AND serie <= 10),
  curso text NOT NULL,
  apto_rematricula boolean DEFAULT true,
  situacao_financeira text NOT NULL CHECK (situacao_financeira IN ('Adimplente', 'Inadimplente')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE candidatos_rematricula ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos podem visualizar candidatos"
  ON candidatos_rematricula FOR SELECT
  USING (true);

CREATE POLICY "Todos podem inserir candidatos"
  ON candidatos_rematricula FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Todos podem deletar candidatos"
  ON candidatos_rematricula FOR DELETE
  USING (true);