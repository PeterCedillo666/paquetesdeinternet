const Service = require('../models/Service')
const User = require('../models/User')

// Obtener todos los servicios (público para home, filtrado para dashboard)
const obtenerServicios = async (req, res) => {
  try {
    const usuario = req.usuario // Puede ser undefined si no está autenticado
    let servicios

    if (!usuario) {
      // Vista pública: mostrar todos los servicios
      servicios = await Service.findAll({
        include: [{
          model: User,
          as: 'usuario',
          attributes: ['id', 'nombre', 'rol']
        }],
        order: [['createdAt', 'DESC']]
      })
    } else if (usuario.rol === 'superadmin') {
      // Superadmin: ver todos los servicios
      servicios = await Service.findAll({
        include: [{
          model: User,
          as: 'usuario',                
          attributes: ['id', 'nombre', 'rol']
        }],
        order: [['createdAt', 'DESC']]
      })
    } else if (usuario.rol === 'admin') {
      // Admin: solo sus servicios
      servicios = await Service.findAll({
        where: { usuarioId: usuario.id },
        include: [{
          model: User,
          as: 'usuario',
          attributes: ['id', 'nombre', 'rol']
        }],
        order: [['createdAt', 'DESC']]
      })
    } else {
      // Cliente: ver todos los servicios (solo lectura)
      servicios = await Service.findAll({
        include: [{
          model: User,
          as: 'usuario',
          attributes: ['id', 'nombre', 'rol']
        }],
        order: [['createdAt', 'DESC']]
      })
    }

    res.json({
      error: false,
      mensaje: 'Servicios obtenidos exitosamente',
      total: servicios.length,
      datos: servicios,
      usuario: usuario
        ? {
          id: usuario.id,
          nombre: usuario.nombre,
          rol: usuario.rol
        }
        : null
    })
  } catch (error) {
    console.error('Error al obtener servicios:', error)
    res.status(500).json({
      error: true,
      mensaje: 'Error interno del servidor',
      detalles: error.message
    })
  }
}

// Crear servicio (solo admin y superadmin)
const crearServicio = async (req, res) => {
  try {
    const { nombre, descripcion, precio } = req.body
    const usuario = req.usuario

    // Validaciones básicas
    if (!nombre || !precio) {
      return res.status(400).json({
        error: true,
        mensaje: 'Nombre y precio son obligatorios'
      })
    }

    // Crear servicio asociado al usuario
    const nuevoServicio = await Service.create({
      nombre,
      descripcion,
      precio: parseFloat(precio),
      usuarioId: usuario.id
    })

    // Incluir datos del usuario en la respuesta
    const servicioConUsuario = await Service.findByPk(nuevoServicio.id, {
      include: [{
        model: User,
        as: 'usuario',
        attributes: ['id', 'nombre', 'rol']
      }]
    })

    res.status(201).json({
      error: false,
      mensaje: 'Servicio creado exitosamente',
      servicio: servicioConUsuario
    })
  } catch (error) {
    console.error('Error al crear servicio:', error)
    res.status(500).json({
      error: true,
      mensaje: 'Error interno del servidor',
      detalles: error.message
    })
  }
}

// Actualizar servicio (solo propietario o superadmin)
const actualizarServicio = async (req, res) => {
  try {
    const { id } = req.params
    const { nombre, descripcion, precio } = req.body
    const usuario = req.usuario

    // Buscar servicio
    const servicio = await Service.findByPk(id)
    if (!servicio) {
      return res.status(404).json({
        error: true,
        mensaje: 'Servicio no encontrado'
      })
    }

    // Verificar permisos
    if (usuario.rol !== 'superadmin' && servicio.usuarioId !== usuario.id) {
      return res.status(403).json({
        error: true,
        mensaje: 'No tienes permisos para actualizar este servicio'
      })
    }

    // Actualizar servicio
    await servicio.update({
      nombre: nombre || servicio.nombre,
      descripcion: descripcion !== undefined ? descripcion : servicio.descripcion,
      precio: precio !== undefined ? parseFloat(precio) : servicio.precio
    })

    // Obtener servicio actualizado con usuario
    const servicioActualizado = await Service.findByPk(id, {
      include: [{
        model: User,
        as: 'usuario',
        attributes: ['id', 'nombre', 'rol']
      }]
    })

    res.json({
      error: false,
      mensaje: 'Servicio actualizado exitosamente',
      servicio: servicioActualizado
    })
  } catch (error) {
    console.error('Error al actualizar servicio:', error)
    res.status(500).json({
      error: true,
      mensaje: 'Error interno del servidor',
      detalles: error.message
    })
  }
}

// Eliminar servicio (solo propietario o superadmin)
const eliminarServicio = async (req, res) => {
  try {
    const { id } = req.params
    const usuario = req.usuario

    // Buscar servicio
    const servicio = await Service.findByPk(id)
    if (!servicio) {
      return res.status(404).json({
        error: true,
        mensaje: 'Servicio no encontrado'
      })
    }

    // Verificar permisos
    if (usuario.rol !== 'superadmin' && servicio.usuarioId !== usuario.id) {
      return res.status(403).json({
        error: true,
        mensaje: 'No tienes permisos para eliminar este servicio'
      })
    }

    await servicio.destroy()

    res.json({
      error: false,
      mensaje: 'Servicio eliminado exitosamente'
    })
  } catch (error) {
    console.error('Error al eliminar servicio:', error)
    res.status(500).json({
      error: true,
      mensaje: 'Error interno del servidor',
      detalles: error.message
    })
  }
}

module.exports = {
  obtenerServicios,
  crearServicio,
  actualizarServicio,
  eliminarServicio
}
