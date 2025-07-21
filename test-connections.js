const { Client } = require('pg');
const redis = require('redis');
require('dotenv').config();

async function testPostgreSQL() {
  console.log('🔍 Testando conexão PostgreSQL...');
  console.log('📡 URL:', process.env.DATABASE_URL);
  
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();
    console.log('✅ PostgreSQL conectado com sucesso!');
    
    // Teste de criação de tabela
    await client.query(`
      CREATE TABLE IF NOT EXISTS test_persistence (
        id SERIAL PRIMARY KEY,
        message TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Inserir dados de teste
    await client.query(
      'INSERT INTO test_persistence (message) VALUES ($1)',
      [`Teste de persistência - ${new Date().toISOString()}`]
    );
    
    // Verificar dados
    const result = await client.query('SELECT COUNT(*) as total FROM test_persistence');
    console.log('📊 Total de registros na tabela de teste:', result.rows[0].total);
    
    // Mostrar últimos registros
    const recent = await client.query(
      'SELECT * FROM test_persistence ORDER BY created_at DESC LIMIT 3'
    );
    console.log('📝 Últimos registros:');
    recent.rows.forEach((row, index) => {
      console.log(`  ${index + 1}. ${row.message} (${row.created_at})`);
    });
    
    await client.end();
  } catch (error) {
    console.error('❌ Erro ao conectar PostgreSQL:', error.message);
    console.error('🔧 Detalhes:', error);
  }
}

async function testRedis() {
  console.log('🔍 Testando conexão Redis...');
  console.log('📡 URL:', process.env.REDIS_URL);
  
  const client = redis.createClient({
    url: process.env.REDIS_URL
  });

  client.on('error', (err) => {
    console.error('❌ Erro Redis:', err);
  });

  try {
    await client.connect();
    console.log('✅ Redis conectado com sucesso!');
    
    // Teste de persistência
    const testKey = 'test_persistence';
    const currentCount = await client.get(testKey) || '0';
    const newCount = parseInt(currentCount) + 1;
    
    await client.set(testKey, newCount.toString());
    console.log('🔢 Contador de testes:', newCount);
    
    // Teste de hash
    const hashKey = 'test_session';
    await client.hSet(hashKey, {
      user: 'test_user',
      timestamp: new Date().toISOString(),
      count: newCount.toString()
    });
    
    const hashData = await client.hGetAll(hashKey);
    console.log('📋 Dados da sessão:', hashData);
    
    // Verificar TTL
    await client.expire(hashKey, 3600); // 1 hora
    const ttl = await client.ttl(hashKey);
    console.log('⏱️  TTL da sessão:', ttl, 'segundos');
    
    await client.disconnect();
  } catch (error) {
    console.error('❌ Erro ao conectar Redis:', error.message);
    console.error('🔧 Detalhes:', error);
  }
}

async function testDockerServices() {
  console.log('🐳 Verificando serviços Docker...');
  
  const { execSync } = require('child_process');
  
  try {
    const containers = execSync('docker-compose ps --format json', { encoding: 'utf8' });
    const services = containers.trim().split('\n').map(line => JSON.parse(line));
    
    console.log('📦 Status dos containers:');
    services.forEach(service => {
      const status = service.State === 'running' ? '✅' : '❌';
      console.log(`  ${status} ${service.Service}: ${service.State}`);
    });
  } catch (error) {
    console.log('⚠️  Docker Compose não está rodando ou não foi encontrado');
  }
}

async function main() {
  console.log('🚀 Iniciando testes de conexão e persistência...\n');
  
  await testDockerServices();
  console.log('');
  
  await testPostgreSQL();
  console.log('');
  
  await testRedis();
  
  console.log('\n✨ Testes concluídos!');
  console.log('\n💡 Dicas:');
  console.log('  - Se os dados não persistem, verifique os volumes Docker');
  console.log('  - Execute "node docker-scripts.js status" para ver o status dos containers');
  console.log('  - Execute "node docker-scripts.js logs" para ver os logs em tempo real');
}

main().catch(console.error);