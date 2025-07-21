const { Client } = require('pg');
require('dotenv').config();

async function checkTables() {
  console.log('🔍 Verificando tabelas no banco de dados...\n');
  
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();
    console.log('✅ Conectado ao PostgreSQL');
    
    // Listar todas as tabelas
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log('\n📋 Tabelas encontradas:');
    result.rows.forEach((row, index) => {
      console.log(`  ${index + 1}. ${row.table_name}`);
    });
    
    // Verificar se há dados em algumas tabelas principais
    const tables = ['users', 'clients', 'agents', 'documents', 'budgets'];
    
    console.log('\n📊 Contagem de registros:');
    for (const table of tables) {
      try {
        const count = await client.query(`SELECT COUNT(*) as total FROM ${table}`);
        console.log(`  ${table}: ${count.rows[0].total} registros`);
      } catch (error) {
        console.log(`  ${table}: tabela não encontrada`);
      }
    }
    
    await client.end();
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

checkTables();