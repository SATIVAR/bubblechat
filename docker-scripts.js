#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const commands = {
  up: 'docker-compose up -d',
  down: 'docker-compose down',
  restart: 'docker-compose restart',
  logs: 'docker-compose logs -f',
  status: 'docker-compose ps',
  clean: 'docker-compose down -v --remove-orphans',
  rebuild: 'docker-compose down && docker-compose build --no-cache && docker-compose up -d',
  'db-reset': 'docker-compose down postgres && docker volume rm bubblechat_postgres_data && docker-compose up -d postgres',
  'redis-reset': 'docker-compose down redis && docker volume rm bubblechat_redis_data && docker-compose up -d redis'
};

function runCommand(cmd) {
  try {
    console.log(`🚀 Executando: ${cmd}`);
    execSync(cmd, { stdio: 'inherit' });
  } catch (error) {
    console.error(`❌ Erro ao executar comando: ${error.message}`);
    process.exit(1);
  }
}

function showHelp() {
  console.log(`
🐳 Docker Scripts para Bubblechat

Comandos disponíveis:
  up        - Iniciar todos os serviços
  down      - Parar todos os serviços
  restart   - Reiniciar todos os serviços
  logs      - Mostrar logs em tempo real
  status    - Status dos containers
  clean     - Parar e remover volumes (CUIDADO: apaga dados!)
  rebuild   - Rebuild completo dos containers
  db-reset  - Reset do banco PostgreSQL (CUIDADO: apaga dados!)
  redis-reset - Reset do Redis (CUIDADO: apaga dados!)

Uso:
  node docker-scripts.js <comando>
  
Exemplos:
  node docker-scripts.js up
  node docker-scripts.js logs
  node docker-scripts.js status
`);
}

const command = process.argv[2];

if (!command || command === 'help' || command === '--help') {
  showHelp();
  process.exit(0);
}

if (!commands[command]) {
  console.error(`❌ Comando '${command}' não encontrado.`);
  showHelp();
  process.exit(1);
}

// Verificar se o arquivo .env.docker existe
if (!fs.existsSync('.env.docker')) {
  console.error('❌ Arquivo .env.docker não encontrado!');
  console.log('📝 Criando arquivo .env.docker...');
  
  if (fs.existsSync('.env')) {
    fs.copyFileSync('.env', '.env.docker');
    console.log('✅ Arquivo .env.docker criado baseado no .env');
  } else {
    console.error('❌ Arquivo .env também não encontrado. Crie um arquivo .env primeiro.');
    process.exit(1);
  }
}

// Criar diretório uploads se não existir
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Diretório uploads criado');
}

runCommand(commands[command]);

if (command === 'up') {
  console.log(`
✅ Serviços iniciados com sucesso!

🌐 Acessos:
  - PostgreSQL: localhost:5432
  - Redis: localhost:6379
  - Admin Dashboard: http://localhost:3001

📊 Para verificar status: node docker-scripts.js status
📝 Para ver logs: node docker-scripts.js logs
`);
}