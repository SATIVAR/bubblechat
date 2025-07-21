-- Inicialização do banco de dados Bubblechat
-- Este arquivo é executado automaticamente quando o container PostgreSQL é criado

-- Criar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Criar índices para busca de texto
-- (Serão criados automaticamente pelo Prisma, mas deixamos aqui como referência)

-- Inserir dados iniciais se necessário
-- INSERT INTO users (id, email, name, role) VALUES 
-- (uuid_generate_v4(), 'admin@bubblechat.com', 'Super Admin', 'ADMIN')
-- ON CONFLICT (email) DO NOTHING;