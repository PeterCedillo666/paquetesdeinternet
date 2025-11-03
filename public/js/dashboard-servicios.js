const API_URL = '/api/services'

function getToken () {
  return localStorage.getItem('token')
}

async function cargarServicios () {
  try {
    // En el DASHBOARD siempre usar la ruta autenticada con filtrado por usuario
    const token = localStorage.getItem('token')
    let currentUserRole = null

    if (!token) {
      console.error('No hay token de autenticación')
      return
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      currentUserRole = payload.role
    } catch (e) {
      console.error('Error al decodificar token:', e)
      return
    }

    console.log('🏢 Cargando servicios del dashboard para rol:', currentUserRole)

    const res = await fetch('/api/services', {
      headers: { Authorization: `Bearer ${token}` }
    })

    const servicios = await res.json()

    const tbody = document.getElementById('tabla-servicios')
    tbody.innerHTML = ''

    servicios.forEach(s => {
      console.log('🔍 Servicio del dashboard:', s)
      const tr = document.createElement('tr')

      // En el dashboard SIEMPRE mostrar botones de acción
      tr.innerHTML = `
        <td>${s.nombre}</td>
        <td>${s.description || ''}</td>
        <td>$${s.price}</td>
        <td>
          <button onclick="editar(${s.id || s._id})">Editar</button>
          <button onclick="eliminar(${s.id || s._id})">Eliminar</button>
        </td>
      `

      tbody.appendChild(tr)
    })
  } catch (error) {
    console.error('Error cargando servicios del dashboard:', error)
  }
}

function editar (id) { // eslint-disable-line no-unused-vars
  console.log('🔧 Editando servicio ID:', id)
  location.href = `editar-servicio.html?id=${id}`
}

async function eliminar (id) { // eslint-disable-line no-unused-vars
  console.log('🗑️ Eliminando servicio ID:', id)
  if (!confirm('¿Seguro que deseas eliminar este servicio?')) return

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${getToken()}` }
    })

    if (res.ok) {
      alert('Servicio eliminado')
      cargarServicios()
    } else {
      const error = await res.json()
      alert(error.message || 'Error al eliminar')
    }
  } catch (error) {
    console.error('Error al eliminar servicio:', error)
    alert('Error de conexión al eliminar el servicio')
  }
}

document.addEventListener('DOMContentLoaded', cargarServicios)
