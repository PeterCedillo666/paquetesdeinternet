// Servidor ultra básico para encontrar el problema
require('dotenv').config();
const express = require('express')
const path = require('path')
const { connectDB } = require('./src/config/db')

const cors = require('cors')

const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
// Importar modelos

require('./src/models/index')

const app = express()
const PORT = 3000

// Middleware de seguridad
app.use(helmet({
  contentSecurityPolicy: false, // Deshabilitado para permitir estilos inline
  crossOriginEmbedderPolicy: false // Deshabilitado para compatibilidad
}))

// Rate limiting - límite general
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  message: 'Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde.',
  standardHeaders: true,
  legacyHeaders: false
})

// Rate limiting específico para auth (más restrictivo)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 intentos de login por IP
  message: 'Demasiados intentos de login, intenta de nuevo más tarde.',
  standardHeaders: true,
  legacyHeaders: false
})

app.use(limiter)

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}))

app.use(express.json())
app.use(express.static('public'))

async function startServer () {
  try {
    await connectDB()
    console.log('✅ DB conectada')

    // Importar rutas de auth DESPUÉS de DB
    const authRoutes = require('./src/routes/auth.routes')

    // Importar controladores y middlewares
    const { obtenerServicios, crearServicio, actualizarServicio, eliminarServicio } = require('./src/controllers/services.controllers')
    const { verificarToken, adminOSuperadmin } = require('./src/middlewares/auth.middleware')

    // RUTAS DE PÁGINAS
    app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'index.html'))
    })

    app.get('/login', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'login.html'))
    })

    app.get('/registro', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'registro.html'))
    })

    app.get('/dashboard', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'dashboard.html'))
    })

    // Agregar ruta de saludo
    app.get('/api/saludo', (req, res) => {
      res.json({
        mensaje: '¡Hola desde el servidor Node.js!',
        fecha: new Date().toLocaleString(),
        sesion: 4
      })
    })

    // Usar rutas de auth
    app.use('/api/auth/', authLimiter, authRoutes)

    // Agregar rutas CRUD completas - ORDEN IMPORTANTE
    app.get('/api/services/publicos', obtenerServicios)
    app.get('/api/services', verificarToken, obtenerServicios)
    app.post('/api/services', verificarToken, adminOSuperadmin, crearServicio)
    app.put('/api/services/:id', verificarToken, adminOSuperadmin, actualizarServicio)
    app.delete('/api/services/:id', verificarToken, adminOSuperadmin, eliminarServicio)

    // Servicio por ID (público) - DEBE IR AL FINAL
    app.get('/api/services/:id', async (req, res) => {
      try {
        const Service = require('./src/models/Service')
        const User = require('./src/models/User')

        const id = parseInt(req.params.id)
        const servicio = await Service.findByPk(id, {
          include: [{
            model: User,
            as: 'usuario',
            attributes: ['id', 'nombre', 'rol']
          }]
        })

        res.json({
          error: false,
          mensaje: 'Servicio encontrado',
          datos: servicio
        })
      } catch (error) {
        res.status(500).json({
          error: true,
          mensaje: 'Error al buscar servicio',
          detalles: error.message
        })
      }
    })

    app.listen(PORT, () => {
      console.log(`🚀 Servidor en puerto ${PORT}`)
    })
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

startServer()