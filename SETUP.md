# Configuração do Projeto

Este projeto requer uma conexão com um banco de dados Supabase externo.

## Passo 1: Configurar Supabase

1. Crie uma conta em [Supabase](https://supabase.com) (se ainda não tiver)
2. Crie um novo projeto
3. Anote a **URL do projeto** e a **chave anon** (disponíveis em Settings > API)

## Passo 2: Criar a Tabela no Supabase

Execute o seguinte SQL no **SQL Editor** do Supabase:

```sql
-- Criar a tabela operation_patterns
CREATE TABLE operation_patterns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  operation_name TEXT NOT NULL,
  password_rules JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Habilitar acesso público (RLS configurado para permitir todas as operações)
ALTER TABLE operation_patterns ENABLE ROW LEVEL SECURITY;

-- Política para permitir SELECT público
CREATE POLICY "Permitir leitura pública"
ON operation_patterns
FOR SELECT
TO anon
USING (true);

-- Política para permitir INSERT público
CREATE POLICY "Permitir inserção pública"
ON operation_patterns
FOR INSERT
TO anon
WITH CHECK (true);

-- Política para permitir UPDATE público
CREATE POLICY "Permitir atualização pública"
ON operation_patterns
FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);

-- Política para permitir DELETE público
CREATE POLICY "Permitir exclusão pública"
ON operation_patterns
FOR DELETE
TO anon
USING (true);
```

## Passo 3: Configurar Variáveis de Ambiente

1. Copie o arquivo `.env.example` para `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edite `.env.local` e adicione suas credenciais:
   ```
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
   ```

## Passo 4: Instalar Dependências e Executar

```bash
npm install
npm run dev
```

## Estrutura da Tabela

A tabela `operation_patterns` armazena os padrões de senha com a seguinte estrutura:

- `id`: UUID (gerado automaticamente)
- `operation_name`: Nome da operação (ex: "Cliente XPTO")
- `password_rules`: Objeto JSON com as regras:
  - `length`: Comprimento da senha
  - `requireUppercase`: Exigir maiúsculas
  - `requireLowercase`: Exigir minúsculas
  - `requireNumber`: Exigir números
  - `requireSpecial`: Exigir caracteres especiais
  - `allowedSpecialChars`: Caracteres especiais permitidos
- `created_at`: Timestamp de criação

## Segurança

⚠️ **IMPORTANTE**: Este projeto foi configurado para acesso totalmente público conforme solicitado. Em um ambiente de produção, considere adicionar camadas de segurança adequadas ao seu caso de uso.
