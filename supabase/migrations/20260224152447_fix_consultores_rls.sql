/*
  # Corrigir RLS da tabela consultores

  1. Mudanças
    - Remove política existente que requer autenticação
    - Adiciona nova política permitindo leitura pública (anon)
    
  2. Motivo
    - A aplicação não tem autenticação implementada
    - Consultores precisam ser visíveis no dropdown do formulário
*/

DROP POLICY IF EXISTS "Consultores podem ser lidos por todos" ON consultores;

CREATE POLICY "Consultores podem ser lidos publicamente"
  ON consultores
  FOR SELECT
  TO anon, authenticated
  USING (true);