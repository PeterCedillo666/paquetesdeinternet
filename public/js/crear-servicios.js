const API_URL = '/api/services'

function getToken () {
  return localStorage.getItem('token')
}

document.getElementById('formCrearServicio').addEventListener('submit', async e => {
  e.preventDefault()

  const nombre = document.getElementById('nombre').value.trim()
  const descripcion = document.getElementById('descripcion').value.trim()
  const precio = parseFloat(document.getElementById('precio').value)

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify({ nombre, descripcion, precio })
    })

    if (res.ok) {
      alert('Servicio creado con éxito')
      window.location.href = 'dashboard.html'
    } else {
      const data = await res.json()
      alert(data.message || 'Error al crear el servicio')
    }
  } catch (error) {
    alert('Error en la conexión al servidor')
    console.error(error)
  }
})