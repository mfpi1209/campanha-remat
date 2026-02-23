/*
  # Criar sistema de campanha de rematrícula

  1. Novas Tabelas
    - `campanhas`
      - `id` (uuid, chave primária)
      - `situacao_financeira` (text) - Adimplente ou Inadequplente
      - `descricao` (text) - Descrição da campanha
      - `created_at` (timestamp)
    
    - `matriculas`
      - `id` (uuid, chave primária)
      - `nome` (text) - Nome do aluno
      - `rgm` (text) - RGM do aluno
      - `serie` (integer) - Série de 1 a 10
      - `situacao_financeira` (text) - Adimplente ou Inadequplente
      - `valor_mensalidade` (numeric) - Valor da mensalidade
      - `mensalidades_restantes` (integer) - Quantidade de mensalidades restantes no semestre
      - `campanha_id` (uuid) - Referência para a campanha
      - `created_at` (timestamp)

  2. Segurança
    - Habilitar RLS em todas as tabelas
    - Adicionar políticas para operações básicas
*/

-- Criar tabela de campanhas
CREATE TABLE IF NOT EXISTS campanhas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  situacao_financeira text NOT NULL CHECK (situacao_financeira IN ('Adimplente', 'Inadimplente')),
  descricao text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Criar tabela de matrículas
CREATE TABLE IF NOT EXISTS matriculas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  rgm text NOT NULL,
  serie integer NOT NULL CHECK (serie >= 1 AND serie <= 10),
  situacao_financeira text NOT NULL CHECK (situacao_financeira IN ('Adimplente', 'Inadimplente')),
  valor_mensalidade numeric NOT NULL CHECK (valor_mensalidade > 0),
  mensalidades_restantes integer NOT NULL CHECK (mensalidades_restantes >= 0),
  campanha_id uuid REFERENCES campanhas(id),
  created_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE campanhas ENABLE ROW LEVEL SECURITY;
ALTER TABLE matriculas ENABLE ROW LEVEL SECURITY;

-- Políticas para campanhas
CREATE POLICY "Todos podem visualizar campanhas"
  ON campanhas FOR SELECT
  USING (true);

CREATE POLICY "Todos podem inserir campanhas"
  ON campanhas FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Todos podem atualizar campanhas"
  ON campanhas FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Todos podem deletar campanhas"
  ON campanhas FOR DELETE
  USING (true);

-- Políticas para matrículas
CREATE POLICY "Todos podem visualizar matr\u00edculas"
  ON matriculas FOR SELECT
  USING (true);

CREATE POLICY "Todos podem inserir matr\u00edculas"
  ON matriculas FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Todos podem atualizar matr\u00edculas"
  ON matriculas FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Todos podem deletar matr\u00edculas"
  ON matriculas FOR DELETE
  USING (true);

-- Inserir campanhas de exemplo
INSERT INTO campanhas (situacao_financeira, descricao) VALUES
  ('Adimplente', 'Desconto de 10% para pagamento antecipado'),
  ('Inadimplente', 'Parcelamento especial em até 12x sem juros')
ON CONFLICT DO NOTHING;