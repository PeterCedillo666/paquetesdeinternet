// scripts/setup-database.js - Script para inicializar la base de datos
const mysql = require('mysql2/promise')

async function setupDatabase () {
  let connection

  try {
    // Conectar a MySQL sin especificar base de datos
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root'
    })

    console.log('✅ Conectado a MySQL')

    // Crear la base de datos si no existe
    await connection.execute('CREATE DATABASE IF NOT EXISTS backend_app')
    console.log('📊 Base de datos "backend_app" creada o ya existe')

    // Verificar que la base de datos existe
    const [databases] = await connection.execute('SHOW DATABASES LIKE "backend_app"')
    if (databases.length > 0) {
      console.log('✅ Base de datos verificada correctamente')
    }

    console.log('\n🎉 ¡Base de datos lista!')
    console.log('Ahora puedes ejecutar: npm start')
  } catch (error) {
    console.error('❌ Error configurando la base de datos:', error.message)
    console.log('\n💡 Sugerencias:')
    console.log('   - Verifica que MySQL esté ejecutándose')
    console.log('   - Verifica las credenciales de MySQL')
    console.log('   - Asegúrate de que el usuario tenga permisos para crear bases de datos')
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}

// Ejecutar si el script se llama directamente
if (require.main === module) {
  setupDatabase()
}

module.exports = setupDatabase
