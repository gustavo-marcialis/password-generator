# Apresentação: Gerador de Senhas Padronizadas

## 1. Visão Geral
O objetivo principal da solução é fornecer aos analistas de Service Desk uma ferramenta para obter regras de senha específicas de operações (clientes/projetos) e gerar senhas seguras e compatíveis com essas regras. [Ver na Web](Gerador de Senhas por Operação)

## 2. O Problema
Durante minha atuação como analista de Service Desk na operação da Seguros Unimed, detectei um retrabalho e gargalo ao gerar senhas no padrão da operação para realizar os resets de senha. Na nossa rotina de trabalo, utilizamos o site Roboform para gerar as senhas para os resets, porém, ao desligar o computador, é necessário configurar do zero a política de senhas para começar a gerar as senhas no padrão desejado. Isso resulta em retrabalho manual e aumento no TMA, principalmente para analistas que atuam em mais de uma operação ao mesmo tempo.


## 3. A Solução
Pensando em otimizar o fluxo de trabalho, desenvolvi um Website e extensão para navegador para cadastrar uma única vez a política de senhas de uma operação e gerar senhas com esse padrão facilmenteo

## 4. Benefícios Gerados
- Reduz o retrabalho ao cadastrar a política de senhas uma única vez;
- Agiliza o atendimento, pois o analista, principalmente o que atua em multiplas operações, encontra tudo em um só lugar;
- Padroniza processos ao centralizar a geração de senhas de todas as operações em um só lugar;
- Facilita o uso para analistas com uma interface limpa e fluida, sem reconfiguração manual.

## 5. Detalhes Técnicos da Solução


1.  **Página de Geração:** Uma interface limpa onde os usuários podem selecionar uma Operação e gerar uma nova senha que adere às regras desse padrão.

2. **Página de Dashboard:** Uma interface de administração para Criar, Ler, Atualizar e Excluir (CRUD) os padrões de operação armazenados no banco de dados.


### 5.1 Arquitetura da Solução
A arquitetura é baseada em um frontend desacoplado que consome diretamente um serviço de banco de dados na nuvem.

**Frontend:** Construído com React e Vite. É responsável por toda a renderização da UI, gerenciamento de estado e lógica de geração de senha (executada no lado do cliente).

**Backend (BaaS):** O Supabase é utilizado exclusivamente para persistência de dados (PostgreSQL). A comunicação é feita diretamente do cliente React para a API do Supabase através das credenciais de url e anon-key, inseridas em variáveis de ambiente para não serem expostas no código. (solução provisória).

**Estilização:** Utiliza Tailwind CSS com a biblioteca de componentes shadcn/ui para uma UI moderna e consistente.

### 5.2 Stack de Tecnologias
Abaixo estão as principais tecnologias e bibliotecas utilizadas no projeto.

| Categoria | Tecnologia | Propósito |
| :--- | :--- | :--- |
| **Framework/UI** | React | Biblioteca principal para construção da interface de usuário. |
| **Build Tool** | Vite | Ferramenta de build e servidor de desenvolvimento (configurado em `vite.config.ts`). |
| **Linguagem** | TypeScript | Superset do JavaScript que adiciona tipagem estática. |
| **Roteamento** | `react-router-dom` | Para navegação entre as páginas `/` e `/dashboard`. |
| **Estilização** | Tailwind CSS | Framework CSS utility-first (configurado em `tailwind.config.ts`). |
| **Componentes** | `shadcn/ui` (Radix UI) | Biblioteca de componentes de UI acessíveis e reutilizáveis (ex: `Button`, `Card`, `Select`). |
| **Banco de Dados** | Supabase | Utilizado como banco de dados PostgreSQL para armazenar os padrões de senha. |
| **Formulários** | `react-hook-form` | Gerenciamento de estado do formulário de criação/edição de padrões. |
| **Notificações** | `sonner` | Biblioteca de "toasts" (notificações) leves para feedback ao usuário. |
| **Utilitários (CSS)**| `clsx`, `tailwind-merge` | Funções para mesclar classes do Tailwind dinamicamente. |

### 5.3 luxo: Geração de Senha
Usuário acessa /: O componente Index.tsx é renderizado.

Busca Padrões: useEffect dispara fetchPatterns(), que executa o Supabase. O RLS permite a consulta.

Seleção: Os padrões retornados populam o componente Select. O usuário seleciona uma Operação.

Geração: O usuário clica em "Gerar Senha".

Lógica Client-side: A função handleGeneratePassword localiza as regras (password_rules) do padrão selecionado e as envia para a função generatePassword.

Criação da Senha: generatePassword constrói um pool de caracteres com base nas regras, garante que os caracteres obrigatórios estejam presentes, preenche o restante do comprimento e embaralha a string final.

Exibição: A senha gerada é passada via props para PasswordDisplay.tsx.

Cópia: O usuário clica em "Copiar". PasswordDisplay.tsx usa navigator.clipboard.writeText(password) para copiar a senha e exibe um toast de sucesso.

### 5.3 luxo: Cadastro de Política de Senha
Usuário acessa /dashboard: O componente Dashboard.tsx é renderizado.

Formulário: O usuário preenche os campos no componente PatternForm. O estado é gerenciado por react-hook-form.

Submissão: O usuário clica em "Salvar Padrão".

Ação de Inserção: A função handleSubmit em Dashboard.tsx é chamada. Ela formata os dados do formulário no objeto password_rules (conforme a interface PasswordRules) e executa supabase.from('operation_patterns').insert(...).

Autorização: A política Permitir inserção pública no Supabase permite a operação.

Feedback: Um toast (sonner) de sucesso é exibido e a lista de padrões é atualizada chamando fetchPatterns() novamente.


## Extensão para Navegador

### 1. Visão Geral

O objetivo principal da solução é fornecer aos colaboradores uma ferramenta de *popup* que se conecta a um banco de dados Supabase para obter políticas de senha específicas de operações e gerar senhas seguras e compatíveis com essas regras.

A solução é desenhada com base nas diretrizes de segurança do **Manifest V3 (MV3)**, garantindo um ambiente de execução restrito e seguro.

A extensão tem a função apenas de gerar senhas, a parte de cadastrar, editar e excluir políticas de senha é exclusica da versão WEB.

### 2. Arquitetura da Solução

O fluxo de dados é o seguinte:

`Utilizador (clica no ícone)` → `index.html (popup)` → `script.js (carrega)` → `supabase.min.js (conecta)` → `Supabase (Backend)` → `RLS Policy (valida)` → `operation_patterns (tabela)` → `script.js (recebe regras)` → `Utilizador (seleciona padrão)` → `script.js (gera senha)` → `Utilizador (copia senha)`



### 3. Tecnologias Utilizadas

* **Extensão (Frontend):**
    * **Manifest V3:** A plataforma moderna e segura para extensões do Chrome.
    * **HTML5:** Para a estrutura do popup.
    * **CSS3 (Tailwind CSS):** Para estilização da UI (via CDN, permitido para CSS).
    * **JavaScript (ES6+):** Para toda a lógica da aplicação, eventos de UI e geração de senha.
    * **LocalStorage:** Para persistir a última operação selecionada pelo utilizador.
* **Comunicação:**
    * **Supabase-JS v2:** Biblioteca cliente para comunicação com o Supabase (carregada localmente).
* **Backend:**
    * **Supabase:** Plataforma "Backend as a Service".
    * **PostgreSQL:** O banco de dados relacional subjacente para armazenar os padrões.
    * **RLS (Row Level Security):** O mecanismo de segurança do PostgreSQL usado para expor a tabela `operation_patterns` em modo "read-only".

---

### 4. Estrutura de Arquivos da Extensão

#### 4.1. `manifest.json`

O `manifest.json` é o arquivo de configuração central. Define os metadados, permissões e pontos de entrada da extensão.

* **Propriedades Chave:**
    * `"manifest_version": 3`
        * **Motivo:** Define o uso da plataforma Manifest V3. Isto impõe restrições de segurança rigorosas, como a proibição de código remoto.
    * `"action": { "default_popup": "index.html" }`
        * **Motivo:** Especifica que, quando o utilizador clicar no ícone da extensão, o arquivo `index.html` deve ser renderizado como um popup.
    * `"permissions": ["storage", "clipboardWrite"]`
        * **Motivo:** Solicita as permissões mínimas necessárias.
            * `storage`: Utilizado pelo `script.js` para aceder ao `localStorage` e guardar o último padrão selecionado.
            * `clipboardWrite`: Permite que o botão "Copiar" utilize o `navigator.clipboard.writeText()` para copiar a senha gerada.
    * `"host_permissions": ["https://hapnzfaqqyevewsxblht.supabase.co/"]`
        * **Motivo (Crítico para Segurança):** Esta é a permissão mais importante. O Manifest V3 bloqueia todas as requisições de rede externas por defeito. Esta linha autoriza explicitamente o `script.js` a fazer requisições (via `fetch` ou XHR, que o `supabase.min.js` usa) **apenas** para o domínio da API Supabase. Nenhuma outra comunicação externa é permitida.

#### 4.2. `index.html`

O `index.html` define a estrutura DOM (a interface) do popup.

* **Conteúdo:**
    * **Cabeçalho (head):** Carrega o Tailwind CSS (via CDN) e o `styles.css` local. (Nota: Carregar *CSS* de CDNs é permitido pela política de `style-src` padrão; carregar *scripts* não é).
    * **Corpo (body):** Contém os elementos da UI (logo, título, campo de output da senha, botão de copiar, o menu `<select id="passwordPattern">` e o botão "Gerar Senha").
    * **Carregamento de Scripts:**
        * `<script src="supabase.min.js"></script>`
        * `<script src="script.js"></script>`
        * **Motivo da Ordem:** É crucial que `supabase.min.js` seja carregado primeiro, pois ele expõe o objeto `supabase` global que `script.js` utiliza para criar o `supabaseClient`.

#### 4.3. `supabase.min.js`

Este arquivo é uma cópia local da biblioteca `supabase-js@2`.

* **Motivo (Crítico para Segurança):**
    * A Política de Segurança de Conteúdo (CSP) padrão do Manifest V3 é `script-src 'self'`.
    * Isto **proíbe** o carregamento de scripts de CDNs ou qualquer fonte externa (ex: `<script src="https://cdn.jsdelivr.net/npm/@supabase...">`).
    * Para contornar esta restrição de forma segura e aprovada, a biblioteca é "empacotada" localmente com a extensão. A extensão agora carrega o script do seu próprio contexto (`'self'`), o que é permitido pela CSP.

#### 4.4. `script.js`

Este é o arquivo principal que contém toda a lógica da aplicação.

* **Conteúdo (Lógica Sequencial):**
    1.  **Configuração do Cliente Supabase:**
        * As constantes `SUPABASE_URL` e `SUPABASE_KEY` (a chave pública `anon`) são definidas.
        * `const supabaseClient = supabase.createClient(...)`: Inicializa o cliente usando o objeto `supabase` (fornecido por `supabase.min.js`).
    2.  **Variáveis Globais:**
        * `operacoesPatterns = []`: Um array na memória para armazenar as regras de senha após serem buscadas, evitando múltiplas chamadas ao banco de dados.
    3.  **Evento `DOMContentLoaded`:** O ponto de entrada da ứng dụng.
    4.  **Funções de Carregamento de Dados (`loadPatternsFromSupabase`):**
        * Função `async` que utiliza `await supabaseClient.from('operation_patterns').select(...)`.
        * Busca os padrões no Supabase.
        * Em caso de sucesso, chama `populatePatternSelect(data)`.
        * Em caso de falha, exibe um erro no console.
    5.  **Funções de UI (`populatePatternSelect`):**
        * Limpa o `<select>` (removendo "Carregando padrões...").
        * Itera sobre os dados recebidos e cria os elementos `<option>` dinamicamente, usando `pattern.operation_name` para o texto e `pattern.id` para o valor.
    6.  **Funções de Geração de Senha (`generateGenericPassword`):**
        * **O "Coração" da Lógica:** Esta função recebe o objeto `pattern` completo.
        * Ela lê o sub-objeto `pattern.password_rules`.
        * Com base na estrutura `PasswordRules` (ex: `length`, `requireUppercase`, `requireLowercase`, `requireNumber`, `requireSpecial`, `allowedSpecialChars`), ela constrói um "banco" de caracteres permitidos (`allChars`) e um array de caracteres garantidos (`guaranteedChars`).
        * Ela preenche o restante da senha e, crucialmente, **embaralha o resultado** (usando o algoritmo Fisher-Yates) para garantir que os caracteres obrigatórios não fiquem sempre no início.
    7.  **Event Listeners (Controladores):**
        * `generateButton.addEventListener('click', ...)`:
            * Obtém o `id` do padrão selecionado.
            * Encontra o objeto `pattern` correspondente no array `operacoesPatterns`.
            * Chama `generateGenericPassword(pattern)`.
            * Define o `.value` do campo de output.
        * `copyButton.addEventListener('click', ...)`:
            * Chama `navigator.clipboard.writeText()` com a senha do output.
        * `passwordPatternSelect.addEventListener('change', ...)`:
            * Salva o `id` selecionado no `localStorage` para persistência.

---

### 6. Arquitetura de Backend (Supabase)

### 6.1. Modelo de Dados

A solução depende de uma única tabela no Supabase.

* **Tabela:** `operation_patterns`
* **Colunas:**
    * `id` (uuid): Chave primária. Usada como o `value` no `<select>`.
    * `operation_name` (text): O nome amigável exibido no menu (ex: "Cliente X", "Projeto Y").
    * `created_at` (timestamptz): Padrão do Supabase.
    * `password_rules` (jsonb): **A coluna crítica.** Armazena um objeto JSON com a definição das regras de senha.

* **Estrutura do `password_rules` (JSONB):**
    ```json
    {
      "length": 16,
      "requireUppercase": true,
      "requireLowercase": true,
      "requireNumber": true,
      "requireSpecial": true,
      "allowedSpecialChars": "!@#$%&*"
    }