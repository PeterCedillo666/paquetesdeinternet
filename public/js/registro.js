document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formRegistro')
  form.addEventListener('submit', registrarCliente)
})

async function registrarCliente (event) {
  event.preventDefault()

  const username = document.getElementById('username').value.trim()
  const email = document.getElementById('email').value.trim()
  const password = document.getElementById('password').value

  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    })

    const data = await response.json()

    if (response.ok) {
      alert('Registro exitoso. Ahora serás redirigido.')
      window.location.href = 'cliente.html' // Cambia por la ruta real
    } else {
      alert(data.message || 'Error al registrar')
    }
  } catch (error) {
    alert('Error en la conexión al servidor')
    console.error(error)
  }
}