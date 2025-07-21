# 🗄️ Configuração dos Bancos de Dados

## Problema Resolvido ✅

Os dados não estavam sendo preservados devido a inconsistências nas configurações entre desenvolvimento local e Docker. Agora tudo está configurado corretamente!

## 🔧 Configurações Corrigidas

### 1. Arquivos de Ambiente

- **`.env`** - Para desenvolvimento local (localhost)
- **`.env.docker`** - Para ambiente Docker (network interno)

### 2. Credenciais Padronizadas

```bash
# PostgreSQL
POSTGRES_USER=bubblechat_user
POSTGRES_PASSWORD=bubblechat_pass
POSTGRES_DB=bubblechat

# Redis
REDIS_PASSWORD=redis_pass
```

### 3. URLs de Conexão

**Desenvolvimento Local (.env):**
```bash
DATABASE_URL="postgresql://bubblechat_user:bubblechat_pass@localhost:5432/bubblechat"
REDIS_URL="redis://:redis_pass@localhost:6379"
```

**Docker (.env.docker):**
```bash
DATABASE_URL="postgresql://bubblechat_user:bubblechat_pass@postgres:5432/bubblechat"
REDIS_URL="redis://:redis_pass@redis:6379"
```

## 🚀 Como Usar

### Opção 1: Docker (Recomendado)

```bash
# Iniciar todos os serviços
node docker-scripts.js up

# Verificar status
node docker-scripts.js status

# Ver logs
node docker-scripts.js logs

# Testar conexões
node test-connections.js
```

### Opção 2: Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Executar aplicações
npm run dev:all

# Testar conexões
node test-connections.js
```

## 🔍 Verificação de Persistência

Execute o teste de conexões múltiplas vezes para verificar se os dados persistem:

```bash
# Primeira execução
node test-connections.js

# Segunda execução (deve mostrar dados anteriores)
node test-connections.js
```

### O que o teste verifica:

**PostgreSQL:**
- ✅ Conexão com o banco
- ✅ Criação de tabela de teste
- ✅ Inserção de dados
- ✅ Contagem de registros (deve aumentar a cada execução)
- ✅ Listagem dos últimos registros

**Redis:**
- ✅ Conexão com o cache
- ✅ Contador persistente (deve aumentar a cada execução)
- ✅ Armazenamento de hash
- ✅ Configuração de TTL

## 🐳 Melhorias no Docker

### Volumes Persistentes
```yaml
volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local
  uploads_data:
    driver: local
```

### Health Checks
- PostgreSQL: Verifica se o banco está aceitando conexões
- Redis: Verifica se o servidor está respondendo

### Restart Policy
- `restart: unless-stopped` - Containers reiniciam automaticamente

### Redis Persistência
- `--appendonly yes` - Habilita persistência AOF
- `--appendfsync everysec` - Sincroniza a cada segundo

### PostgreSQL Otimizado
- `PGDATA` customizado para melhor organização
- Volume montado no diretório correto

## 🛠️ Scripts Disponíveis

### docker-scripts.js
```bash
node docker-scripts.js up        # Iniciar serviços
node docker-scripts.js down      # Parar serviços
node docker-scripts.js restart   # Reiniciar serviços
node docker-scripts.js logs      # Ver logs
node docker-scripts.js status    # Status dos containers
node docker-scripts.js clean     # Limpar tudo (CUIDADO!)
node docker-scripts.js rebuild   # Rebuild completo
node docker-scripts.js db-reset  # Reset PostgreSQL (CUIDADO!)
node docker-scripts.js redis-reset # Reset Redis (CUIDADO!)
```

### test-connections.js
```bash
node test-connections.js         # Testar todas as conexões
```

## 🔒 Segurança

### Senhas Padrão (ALTERE EM PRODUÇÃO!)
- PostgreSQL: `bubblechat_pass`
- Redis: `redis_pass`
- JWT: `your-super-secret-jwt-key-change-in-production`

### Recomendações para Produção:
1. Use senhas fortes e únicas
2. Configure SSL/TLS
3. Limite acesso por IP
4. Use secrets management
5. Configure backups automáticos

## 📊 Monitoramento

### Logs dos Containers
```bash
# Todos os logs
docker-compose logs -f

# Logs específicos
docker-compose logs -f postgres
docker-compose logs -f redis
```

### Métricas
```bash
# Status dos containers
docker-compose ps

# Uso de recursos
docker stats

# Volumes
docker volume ls
```

## 🚨 Troubleshooting

### Dados não persistem?
1. Verifique se os volumes estão criados: `docker volume ls`
2. Verifique se os containers estão rodando: `docker-compose ps`
3. Execute o teste: `node test-connections.js`

### Erro de conexão?
1. Verifique as credenciais no `.env`
2. Verifique se as portas estão livres: `netstat -an | findstr :5432`
3. Reinicie os containers: `node docker-scripts.js restart`

### Performance lenta?
1. Verifique recursos do Docker
2. Otimize configurações do PostgreSQL
3. Configure Redis maxmemory

## ✅ Checklist de Verificação

- [ ] Containers rodando: `docker-compose ps`
- [ ] Volumes criados: `docker volume ls`
- [ ] Conexões funcionando: `node test-connections.js`
- [ ] Dados persistindo: Execute o teste 2x
- [ ] Logs sem erros: `docker-compose logs`

## 🎯 Próximos Passos

1. **Integrar com Prisma** - Configurar ORM para as aplicações
2. **Configurar Backups** - Scripts automáticos de backup
3. **Monitoramento** - Adicionar métricas e alertas
4. **SSL/TLS** - Configurar conexões seguras
5. **Clustering** - Para alta disponibilidade

---

**✨ Agora seus dados estão sendo preservados corretamente!**