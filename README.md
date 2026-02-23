# Sistema de Campanha de Rematrícula

Sistema completo para gerenciamento de campanhas de rematrícula escolar com formulário de cadastro e listagem de alunos.

## Funcionalidades

- Cadastro de matrículas com os seguintes dados:
  - Nome do aluno
  - RGM
  - Série (1 a 10)
  - Situação financeira (Adimplente ou Inadimplente)
  - Valor da mensalidade
  - Quantidade de mensalidades restantes no semestre
  - Campanha associada (baseada na situação financeira)

- Listagem de todas as matrículas cadastradas
- Banco de dados Supabase com campanhas pré-cadastradas
- Interface moderna e responsiva

## Como Configurar

### 1. Clone o Repositório

```bash
git clone https://github.com/mfpi1209/campanha_rematricula.git
cd campanha_rematricula
```

### 2. Instale as Dependências

```bash
npm install
```

### 3. Configure o Supabase

O projeto já possui o banco de dados configurado com as seguintes tabelas:
- `campanhas`: Armazena as campanhas disponíveis por situação financeira
- `matriculas`: Armazena os dados dos alunos matriculados

Campanhas pré-cadastradas:
- **Adimplente**: Desconto de 10% para pagamento antecipado
- **Inadimplente**: Parcelamento especial em até 12x sem juros

### 4. Configure as Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com suas credenciais do Supabase:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

Você pode encontrar essas informações no painel do Supabase em Settings > API.

### 5. Execute o Projeto

```bash
npm run dev
```

O sistema estará disponível em `http://localhost:5173`

## Deploy

### GitHub Pages

1. Atualize o `vite.config.ts` com a base do seu repositório:

```typescript
export default defineConfig({
  base: '/campanha_rematricula/',
  // ... resto da configuração
});
```

2. Execute o build:

```bash
npm run build
```

3. Configure o GitHub Actions ou faça deploy manual da pasta `dist`

### Outras Plataformas

O projeto pode ser facilmente deployado em:
- Vercel
- Netlify
- Cloudflare Pages

Basta conectar seu repositório GitHub e as plataformas farão o deploy automaticamente.

## Estrutura do Projeto

```
src/
├── components/
│   ├── FormularioRematricula.tsx  # Formulário de cadastro
│   └── ListaMatriculas.tsx        # Listagem de matrículas
├── lib/
│   └── supabase.ts                # Configuração do Supabase
├── App.tsx                         # Componente principal
└── main.tsx                        # Ponto de entrada
```

## Tecnologias Utilizadas

- React + TypeScript
- Vite
- Tailwind CSS
- Supabase
- Lucide React (ícones)

## Adicionar Novas Campanhas

Para adicionar novas campanhas, você pode:

1. Acessar o painel do Supabase
2. Ir até a tabela `campanhas`
3. Inserir novos registros com:
   - `situacao_financeira`: "Adimplente" ou "Inadimplente"
   - `descricao`: Descrição da campanha

As novas campanhas aparecerão automaticamente no dropdown do formulário.
