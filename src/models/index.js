// Archivo para establecer relaciones entre modelos
const User = require('./User')
const Service = require('./Service')

// Definir relaciones
User.hasMany(Service, {
  foreignKey: 'usuarioId',
  as: 'servicios'
})

Service.belongsTo(User, {
  foreignKey: 'usuarioId',
  as: 'usuario'
})

module.exports = {
  User,
  Service
}
