# Guía para crear la app Backend Node.js (Sesión 4)

## 1. Crear el proyecto y estructura

```bash
mkdir backend-app
cd backend-app
npm init -y
```

## 2. Instalar dependencias

```bash
npm install express sequelize mysql2 bcryptjs jsonwebtoken
npm install nodemon --save-dev
```

## 3. Crear estructura de carpetas y archivos

```
backend-app/
├── public/
│   ├── index.html
│   ├── login.html
│   ├── registro.html
│   ├── dashboard.html
│   └── js/
├── src/
│   ├── config/db.js
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   └── routes/
├── server.js
├── package.json
```

## 4. Configurar la base de datos MySQL

- Crear la base de datos y tablas usando el script SQL:

```sql
CREATE DATABASE backend_app;
USE backend_app;

CREATE TABLE usuarios (...);
CREATE TABLE servicios (...);
```

## 5. Configurar Sequelize en `src/config/db.js`

- Define la conexión y los modelos `User` y `Service`.

## 6. Crear los controladores y rutas

- `src/controllers/auth.controller.js`: registro, login, perfil
- `src/controllers/service.controller.js`: CRUD de servicios
- `src/routes/auth.routes.js`: rutas de autenticación
- `src/routes/service.routes.js`: rutas de servicios

## 7. Crear los middlewares

- `src/middlewares/auth.middleware.js`: verificación de token y roles

## 8. Configurar el servidor en `server.js`

- Importa modelos, rutas, controladores y middlewares
- Define rutas estáticas y API
- Inicia el servidor

## 9. Crear las páginas frontend en `public/`

- `index.html`: página principal
- `login.html`: formulario de login
- `registro.html`: formulario de registro
- `dashboard.html`: panel de usuario
- JS embebido en cada HTML para manejar formularios y peticiones

## 10. Ejecutar la app

```bash
npm run dev
# o
npm start
```

## 11. Probar la app

- Accede a `http://localhost:3001/` para la página principal
- Accede a `/login`, `/registro`, `/dashboard` para las demás funcionalidades
- Prueba el registro, login y CRUD de servicios

## 12. Seguridad y buenas prácticas

- Las contraseñas se almacenan hasheadas
- El método `toJSON` en el modelo User oculta la contraseña en las respuestas
- Los tokens JWT se usan para autenticación
- Los roles controlan el acceso a rutas protegidas

---

**¡Listo! Tu app Node.js con autenticación y CRUD está funcionando.**
