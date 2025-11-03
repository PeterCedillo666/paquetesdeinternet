const express = require('express')
const router = express.Router()
const { registro, login, crearUsuario, perfil } = require('../controllers/auth.controller')
const { verificarToken, soloSuperadmin } = require('../middlewares/auth.middleware')

// Rutas públicas
router.post('/registro', registro)
router.post('/login', login)

// Rutas protegidas
router.get('/perfil', verificarToken, perfil)
router.post('/crear-usuario', verificarToken, soloSuperadmin, crearUsuario)

module.exports = router

