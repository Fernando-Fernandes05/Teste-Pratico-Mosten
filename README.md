# VotaFlix — Simulador de Votação de Filmes/Séries

Uma aplicação simples para listar conteúdos (filmes/séries), registrar votos de “Gostei” e “Não gostei”, cadastrar novos itens e exibir totais por item e totais gerais.

## Sumário
- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Arquitetura](#arquitetura)
- [Modelagem de Dados](#modelagem-de-dados)
- [API (Back-end)](#api-back-end)
- [Como Rodar o Projeto](#como-rodar-o-projeto)
- [Persistência e Ambiente](#persistência-e-ambiente)

## Visão Geral
- Front-end: HTML, CSS e JavaScript puro (sem frameworks) — diretório `front/`.
- Back-end: Node.js, TypeScript, Express, Prisma e SQLite — diretório `back/`.
- Persistência: banco SQLite local, com seed inicial de 5 conteúdos.

## Funcionalidades
- **Listagem de conteúdos**: pelo menos 5 itens ao iniciar (via seed).
- **Votação**: botões “Gostei” e “Não gostei” por item; contadores atualizados.
- **Contadores**: totais por item e totais gerais (positivos/negativos) na página.
- **Cadastro**: formulário para adicionar novos conteúdos (título, gênero, imagem; descrição opcional) já disponíveis para voto.
- **Persistência**: dados mantidos em SQLite; votos e cadastros não se perdem ao recarregar.

## Arquitetura
- **Camada de dados**: Prisma ORM com SQLite.
- **Domínio**: entidades `Content` (conteúdo) e `Vote` (voto) com relação 1:N.
- **API REST**: rotas para listar conteúdos com agregações, cadastrar conteúdo, registrar voto e consultar totais gerais.
- **UI**: página estática que consome a API, renderiza cards, atualiza contadores e envia votos/cadastros.

## Modelagem de Dados
Entidades principais (Prisma):

- `Content`
  - `id` (Int, PK, autoincrement)
  - `title` (String)
  - `genre` (String)
  - `description` (String?)
  - `imageUrl` (String)
  - `createdAt` (DateTime, default now)
  - `updatedAt` (DateTime, auto)
  - `votes` (Vote[])

- `Vote`
  - `id` (Int, PK, autoincrement)
  - `type` (Enum: `LIKE` | `DISLIKE`)
  - `contentId` (FK → Content)
  - `createdAt` (DateTime, default now)

Decisão: usar `Vote` como entidade mediadora permite manter histórico, fazer agregações simples e escalar para novos tipos de avaliação no futuro.

## API (Back-end)
Base URL: `http://localhost:3333`

### Health
- `GET /health` → `{ ok: true }`

### Conteúdos
- `GET /contents`
  - Resposta: lista de conteúdos com agregados
  ```json
  [
    {
      "id": 1,
      "title": "Inception",
      "genre": "Ficção Científica",
      "description": "...",
      "imageUrl": "https://...",
      "likes": 10,
      "dislikes": 2,
      "createdAt": "2025-08-10T02:00:00.000Z"
    }
  ]
  ```
- `POST /contents`
  - Body:
  ```json
  {
    "title": "Nome", "genre": "Gênero", "imageUrl": "https://...", "description": "opcional"
  }
  ```
  - 201 → `{ id: number }`

### Votos
- `POST /contents/:id/vote`
  - Body:
  ```json
  { "type": "LIKE" }
  ```
  ou
  ```json
  { "type": "DISLIKE" }
  ```
  - 201 → `{ ok: true }`

### Estatísticas
- `GET /stats/positive` → `{ totalPositive: number }`
- `GET /stats/negative` → `{ totalNegative: number }`
- `GET /stats` → `{ totalPositive: number, totalNegative: number }`

## Como Rodar o Projeto
Pré-requisitos: Node.js LTS (>= 18) e npm.

### 1) Back-end
Terminal:
```bash
cd back
npm i
npm run prisma:generate
npx prisma migrate dev --name init
npm run seed
npm run dev
```
O servidor iniciará em `http://localhost:3333`.

Testes rápidos:
```bash
# Saúde
curl http://localhost:3333/health
# Conteúdos
curl http://localhost:3333/contents
# Votar (LIKE) no id 1
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"type":"LIKE"}' \
  http://localhost:3333/contents/1/vote
```

### 2) Front-end
Recomenda-se servir estaticamente para evitar problemas de CORS/file://. Exemplos:
- Usando http-server
```bash
npx http-server front -p 8080
```
- Ou use a extensão "Live Server" no VS Code apontando para a pasta `front/`.

Abra: `http://localhost:8080`.

## Persistência e Ambiente
- Banco SQLite: arquivo `back/prisma/dev.db`.
- Client Prisma gerado em `back/generated/prisma`.
- CORS habilitado no servidor para facilitar o consumo via front local.
