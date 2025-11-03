const { Sequelize } = require('sequelize')

// Configuración de la conexión a MySQL
const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: false, // Desactivar logs SQL para mantener consola limpia
  define: {
    timestamps: true,
    underscored: false
  }
})

// Función para probar la conexión con diferentes configuraciones
const connectDB = async () => {
  try {
    await sequelize.authenticate()
    console.log('✅ Conexión a MySQL establecida correctamente')

    // Sincronizar modelos (crear tablas si no existen)
    await sequelize.sync()
    console.log('📊 Base de datos sincronizada')

    // Insertar datos de ejemplo si las tablas están vacías
    await insertSampleData()
  } catch (error) {
    console.error('❌ Error conectando a la base de datos:', error.message)
    console.log('💡 Sugerencias:')
    console.log('   - Verifica que MySQL esté ejecutándose')
    console.log('   - Verifica usuario/password de MySQL')
    console.log('   - Crea la base de datos: CREATE DATABASE backend_app;')
  }
}

// Función para insertar datos de ejemplo
const insertSampleData = async () => {
  try {
    const Service = require('../models/Service')
    const count = await Service.count()

    if (count === 0) {
      await Service.bulkCreate([
        {
          nombre: 'Desarrollo Web',
          descripcion: 'Creación de sitios web modernos y responsivos',
          precio: 2500.00
        },
        {
          nombre: 'Consultoría IT',
          descripcion: 'Asesoría en tecnologías de información',
          precio: 1800.00
        },
        {
          nombre: 'Diseño UX/UI',
          descripcion: 'Diseño de experiencias de usuario excepcionales',
          precio: 2200.00
        }
      ])
      console.log('📋 Datos de ejemplo insertados')
    }
  } catch (error) {
    console.log('⚠️ No se pudieron insertar datos de ejemplo:', error.message)
  }
}

module.exports = { sequelize, connectDB }
