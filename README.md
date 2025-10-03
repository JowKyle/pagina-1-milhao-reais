# PaginaDe1MilhaoDeReais
Protótipo completo inspirado no "Million Dollar Homepage" — frontend (React/Vite) + backend (Node/Express) + Stripe Checkout + Postgres + S3-compatible storage.

## Como usar (resumo)
1. Copie `.env.example` para `.env` e preencha as variáveis (DATABASE_URL, STRIPE_*, S3_* se for usar).
2. Rode `docker-compose up --build` para rodar localmente (Postgres, backend e frontend).
3. Frontend estará em http://localhost:5173 e backend em http://localhost:4000.

Para deploy em produção, siga as instruções em `infra/README-deploy.md`.


## Observação
O sistema está configurado para usar **Real (BRL)** como moeda padrão no Stripe.


## Preço padrão
Cada pixel está configurado para custar **R$ 1**.
