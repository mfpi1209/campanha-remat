/*
  # Adicionar data_cadastro_campanha à tabela matriculas

  1. Mudanças
    - Adiciona coluna data_cadastro_campanha à tabela matriculas
    - Define valor padrão como now() para registrar automaticamente a data
    
  2. Motivo
    - Necessário registrar quando cada matrícula foi cadastrada na campanha
    - Importante para histórico e relatórios
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'matriculas' AND column_name = 'data_cadastro_campanha'
  ) THEN
    ALTER TABLE matriculas ADD COLUMN data_cadastro_campanha timestamptz DEFAULT now();
  END IF;
END $$;