Guia rápido de deploy:

- Backend: Render, Railway ou Heroku. Configure variáveis de ambiente do .env.
- Banco: use managed Postgres (Supabase, Neon, Railway) e aplique migrations.
- Storage: AWS S3 ou DigitalOcean Spaces. Configure chaves e bucket.
- Frontend: Vercel ou Netlify. Ajuste VITE_API_URL para a URL do backend.
- Stripe: configure webhook apontando para /webhook do backend; use stripe-cli para testes locais.
