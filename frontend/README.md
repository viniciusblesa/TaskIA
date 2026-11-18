# TaskIA Frontend

Aplicativo frontend React + Vite para um quadro Kanban com login, cadastro e integração com API REST.

## Visão geral

Este projeto fornece uma interface de gerenciamento de tarefas em estilo Kanban. O fluxo principal inclui:

- Autenticação de usuário (login e cadastro)
- Criação, edição e exclusão de tarefas
- Ordenação e movimentação de tarefas entre colunas por drag and drop
- Sincronização com backend através de API REST
- Layout com tema escuro ativado automaticamente

## Tecnologias usadas

- React 19
- Vite
- Tailwind CSS
- Axios
- DND Kit (`@dnd-kit/core`, `@dnd-kit/sortable`)
- Shadcn UI / componentes customizados

## Pré-requisitos

- Node.js 18+ instalado
- npm disponível
- Backend disponível e rodando

## Instalação

1. Abra o terminal na pasta do projeto:
   ```bash
## Pré-requisitos

- Node.js 20.19 ou superior
- npm
- Backend instalado e em execução

## Instalação

Na pasta `TaskIA-FrontEnd`, instale as dependências:

```bash
npm ci
```

Copie `.env.example` para `.env` e ajuste `VITE_API_URL` se o backend estiver em outro endereço. O padrão é `http://localhost:3000`.

## Execução

```bash
npm run dev
```

O Vite informa o endereço local, normalmente `http://localhost:5173`.

Scripts adicionais: `npm run lint`, `npm run build` e `npm run preview`.

## Integração

O cliente HTTP está em `src/services/apiServices.js`. O frontend usa estas rotas:

- `GET|POST /api/tasks`
- `GET|PUT|DELETE /api/tasks/:id`
- `POST /users/login`
- `POST /users/register`
- `GET /api/health`

O backend correspondente está no repositório [TaskIA-BackEnd](https://github.com/FVSSANTOS/TaskIA-BackEnd).

## Limitações

O login não cria uma sessão protegida: as rotas de tarefas continuam abertas e os dados são armazenados em arquivos JSON locais. Este projeto é uma demonstração; para usuários reais, implemente autenticação por token, isolamento de tarefas por usuário e um banco de dados.

## Funcionalidades

- Login e cadastro
- Criação, edição e exclusão de tarefas
- Colunas Kanban com drag and drop
- Estimativa opcional de prioridade e esforço com IA

## Equipe

Projeto desenvolvido pela equipe do bootcamp Soulcode em parceria com a Accenture:

- João Vitor — https://github.com/joaovfb20
- Flávio Vinícius — https://github.com/FVSSANTOS
- Adrian Gomes — https://github.com/Adrian1344
- Vinicius Blesa — https://github.com/viniciusblesa
- Lucas Pottes — https://github.com/LucasPottes81
- João Luiz — https://github.com/machinel7

## Agradecimentos

Projeto baseado em Vite + React com componentes Shadcn e DND Kit para experiência de quadro Kanban moderno.
