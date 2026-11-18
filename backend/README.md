# TaskIA Backend

API REST do TaskIA, construída com Express. O armazenamento atual usa os arquivos `task.json`, `columns.json` e `user.json` no diretório do projeto.

## Requisitos

- Node.js 20.19 ou superior
- npm

## Instalação e execução

```bash
npm ci
npm start
```

A API inicia em `http://localhost:3000`. Verifique o serviço em `GET /api/health`.

Copie `.env.example` para `.env` para configurar `PORT` ou uma chave `GOOGLE_API_KEY` para estimativas de tarefas com Gemini. Sem a chave, a criação continua disponível com prioridade padrão.

## Rotas principais

- `GET|POST /api/tasks`
- `GET|PUT|DELETE /api/tasks/:id`
- `GET|POST /api/columns`
- `POST /users/register`
- `POST /users/login`

## Limitações

Este projeto é uma demonstração: as tarefas não são isoladas por usuário, as rotas não exigem autenticação e os arquivos JSON não oferecem persistência adequada para hospedagem escalável. Não use dados reais até adicionar autenticação por token e um banco de dados. Senhas novas são armazenadas com hash; contas antigas são migradas para hash no primeiro acesso.