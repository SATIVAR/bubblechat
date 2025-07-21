#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Configurando Bubblechat Platform...\n');

// Verificar se Node.js está na versão correta
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 18) {
  console.error('❌ Node.js 18+ é necessário. Versão atual:', nodeVersion);
  process.exit(1);
}

console.log('✅ Node.js versão:', nodeVersion);

// Criar arquivo .env se não existir
if (!fs.existsSync('.env')) {
  if (fs.existsSync('.env.example')) {
    fs.copyFileSync('.env.example', '.env');
    console.log('✅ Arquivo .env criado baseado no .env.example');
  } else {
    console.log('⚠️  Arquivo .env.example não encontrado');
  }
} else {
  console.log('✅ Arquivo .env já existe');
}

// Criar arquivo .env.docker se não existir
if (!fs.existsSync('.env.docker')) {
  if (fs.existsSync('.env')) {
    fs.copyFileSync('.env', '.env.docker');
    console.log('✅ Arquivo .env.docker criado baseado no .env');
    
    // Ajustar URLs para Docker
    let dockerEnv = fs.readFileSync('.env.docker', 'utf8');
    dockerEnv = dockerEnv.replace(/localhost:5432/g, 'postgres:5432');
    dockerEnv = dockerEnv.replace(/localhost:6379/g, 'redis:6379');
    fs.writeFileSync('.env.docker', dockerEnv);
    console.log('✅ URLs ajustadas para ambiente Docker');
  }
} else {
  console.log('✅ Arquivo .env.docker já existe');
}

// Criar diretório uploads
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✅ Diretório uploads criado');
} else {
  console.log('✅ Diretório uploads já existe');
}

// Instalar dependências
console.log('\n📦 Instalando dependências...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependências instaladas com sucesso');
} catch (error) {
  console.error('❌ Erro ao instalar dependências:', error.message);
  process.exit(1);
}

// Verificar Docker
console.log('\n🐳 Verificando Docker...');
try {
  execSync('docker --version', { stdio: 'pipe' });
  execSync('docker-compose --version', { stdio: 'pipe' });
  console.log('✅ Docker e Docker Compose estão disponíveis');
} catch (error) {
  console.log('⚠️  Docker não encontrado - modo desenvolvimento local apenas');
}

console.log('\n🎉 Setup concluído com sucesso!');
console.log('\n📋 Próximos passos:');
console.log('1. Configure suas variáveis de ambiente no arquivo .env');
console.log('2. Escolha uma opção de execução:');
console.log('');
console.log('   🐳 Docker (Recomendado):');
console.log('   npm run docker up');
console.log('   npm run test:connections');
console.log('');
console.log('   💻 Desenvolvimento Local:');
console.log('   npm run dev:all');
console.log('   npm run test:connections');

console.log('\n🔗 URLs das aplicações:');
console.log('- API: http://localhost:3000');
console.log('- Admin Dashboard: http://localhost:3001');
console.log('- Widget: http://localhost:3002');

console.log('\n🛠️  Scripts úteis:');
console.log('- npm run docker status    # Status dos containers');
console.log('- npm run docker logs      # Ver logs');
console.log('- npm run test:connections # Testar bancos de dados');
console.log('- npm run docker restart   # Reiniciar serviços');

console.log('\n📚 Documentação:');
console.log('- DATABASE_SETUP.md - Configuração dos bancos de dados');
console.log('- IMPLEMENTATION.md - Documentação completa do projeto');