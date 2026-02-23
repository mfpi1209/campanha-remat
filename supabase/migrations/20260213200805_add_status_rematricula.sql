/*
  # Add status_rematricula to matriculas table

  Adds a new column to track rematrícula status and create a new table to store uploaded confirmation data.
  
  1. New Columns
    - `matriculas.status_rematricula` (text) - Status of rematrícula: 'Aguardando confirmação de rematrícula' or 'Rematrícula feita com Sucesso'
    - `matriculas.data_rematricula` (timestamptz) - Date when rematrícula was confirmed
  
  2. New Tables
    - `rematriculas_confirmadas` - Stores data from uploaded CSV files
      - `id` (uuid)
      - `rgm` (text)
      - `nome` (text)
      - `data_upload` (timestamptz)
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'matriculas' AND column_name = 'status_rematricula'
  ) THEN
    ALTER TABLE matriculas ADD COLUMN status_rematricula text DEFAULT 'Aguardando confirmação de rematrícula';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'matriculas' AND column_name = 'data_rematricula'
  ) THEN
    ALTER TABLE matriculas ADD COLUMN data_rematricula timestamptz;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS rematriculas_confirmadas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rgm text NOT NULL,
  nome text NOT NULL,
  data_upload timestamptz DEFAULT now()
);

ALTER TABLE rematriculas_confirmadas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos podem visualizar rematriculas confirmadas"
  ON rematriculas_confirmadas FOR SELECT
  USING (true);

CREATE POLICY "Todos podem inserir rematriculas confirmadas"
  ON rematriculas_confirmadas FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Todos podem deletar rematriculas confirmadas"
  ON rematriculas_confirmadas FOR DELETE
  USING (true);