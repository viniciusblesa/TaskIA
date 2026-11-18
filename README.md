# TaskIA

Aplicação Kanban com frontend React/Vite e API Express, organizada em um único repositório.

## Requisitos

- Node.js 20.19 ou superior
- npm

## Instalação

Na pasta raiz do projeto:

```bash
npm ci
```

Configure os ambientes locais copiando os exemplos:

```powershell
Copy-Item frontend/.env.example frontend/.env
Copy-Item backend/.env.example backend/.env
```

O frontend usa `VITE_API_URL=http://localhost:3000`. A chave `GOOGLE_API_KEY` do backend é opcional; sem ela, as tarefas são criadas com prioridade padrão.

## Desenvolvimento

Abra dois terminais na raiz:

```bash
npm run dev:backend
```

```bash
npm run dev:frontend
```

A interface fica em `http://localhost:5173` e a API em `http://localhost:3000`. O endpoint `GET /api/health` verifica o backend.

## Verificações

- `npm test` executa os testes do backend.
- `npm run lint` verifica o frontend.
- `npm run build` gera o frontend de produção.

## Estrutura

- `frontend/` contém a aplicação React, componentes e configuração Vite.
- `backend/` contém a API Express, rotas, serviços, testes e dados JSON de demonstração.
- O `package.json` e `package-lock.json` da raiz coordenam os dois workspaces.

## Limitações

Este projeto é uma demonstração. As rotas de tarefas ainda não exigem autenticação e os arquivos JSON não oferecem isolamento por usuário nem persistência adequada para hospedagem escalável. Não use dados reais até implementar autenticação por token e um banco de dados. O arquivo `backend/user.json` é local e ignorado pelo Git.