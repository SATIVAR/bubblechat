const { Client } = require('pg');
require('dotenv').config();

async function createTempUser() {
  console.log('🔧 Criando usuário temporário...\n');
  
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();
    console.log('✅ Conectado ao PostgreSQL');
    
    // Criar usuário temporário
    const result = await client.query(`
      INSERT INTO users (id, email, name, role, "createdAt", "updatedAt") 
      VALUES ('temp-user-id', 'admin@bubblechat.com', 'Admin Temporário', 'ADMIN', NOW(), NOW())
      ON CONFLICT (id) DO NOTHING
      RETURNING *;
    `);
    
    if (result.rows.length > 0) {
      console.log('✅ Usuário temporário criado:', result.rows[0]);
    } else {
      console.log('ℹ️  Usuário temporário já existe');
    }
    
    // Verificar se existe
    const check = await client.query('SELECT * FROM users WHERE id = $1', ['temp-user-id']);
    console.log('📋 Usuário no banco:', check.rows[0]);
    
    await client.end();
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

createTempUser();