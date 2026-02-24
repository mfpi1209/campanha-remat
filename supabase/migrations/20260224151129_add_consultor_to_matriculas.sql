/*
  # Adicionar campo consultor às matrículas

  1. Alterações
    - Adiciona coluna `consultor` à tabela `matriculas`
    - Tipo: texto, permite identificar quem cadastrou a campanha
    - Permite valores nulos para registros antigos
  
  2. Notas
    - Registros existentes terão consultor como NULL
    - Novos registros podem incluir o nome do consultor
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'matriculas' AND column_name = 'consultor'
  ) THEN
    ALTER TABLE matriculas ADD COLUMN consultor text;
  END IF;
END $$;
