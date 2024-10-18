# Aplicación de Gestión de Películas de Star Wars

Este proyecto es una API backend construida con NestJS que permite gestionar una base de datos de películas de Star Wars. La API ofrece funcionalidades para autenticación de usuarios, operaciones CRUD de películas e integración con la API de Star Wars para sincronización de películas.

## 👀 Descripción del Proyecto

Esta aplicación está diseñada para gestionar una colección de películas con autenticación y autorización basada en roles. Existen diferentes roles para los usuarios, como **Usuarios Regulares** y **Administradores**, con distintos permisos para acceder y gestionar películas.

### Principales Características:

1. **Autenticación y Autorización**: 
   - Los usuarios pueden registrarse e iniciar sesión utilizando autenticación basada en JWT.
   - Los roles de autorización (Admin, Regular) restringen el acceso a ciertas operaciones, como crear, actualizar o eliminar películas.
  
2. **Gestión de Usuarios**:
   - Los usuarios pueden registrarse e iniciar sesión.
   - Almacenamiento seguro de contraseñas y validación.

3. **Gestión de Películas**:
   - Los usuarios regulares pueden listar y ver detalles de las películas.
   - Los administradores pueden crear, actualizar y eliminar películas.
   - Los datos de películas se pueden sincronizar con la API de Star Wars.

4. **Documentación de API con Swagger**: 
   - La API está documentada con Swagger para facilitar la interacción.

---

## 🚀 Instalación

1. Clona el repositorio:

   ```bash
   git clone <repository-url>
   ```

2. Instala las dependencias:

   ```bash
   cd <project-folder>
   npm install
   ```

3. Configura las variables de entorno creando un archivo `.env`:

   ```bash
   JWT_SECRET=<tu-secreto-jwt>
   JWT_EXPIRES_IN=<expiracion-jwt>
   MONGODB_URI=<tu-url-de-mongodb>
   ```

4. Inicia la aplicación:

   ```bash
   npm run start
   ```

---

## 🔑 Autenticación y Autorización

La aplicación utiliza **JWT** (JSON Web Tokens) para autenticación segura. Cada usuario tiene un rol específico:

- **Admin**: Puede crear, actualizar y eliminar películas.
- **Usuario Regular**: Puede ver películas, pero no puede realizar tareas administrativas.

Para usar la API, primero debes registrar un usuario e iniciar sesión para obtener un token JWT. Este token debe ser incluido en el encabezado `Authorization` de cada solicitud a los endpoints protegidos.

---

## 👥 Gestión de Usuarios

### Registrar un Nuevo Usuario (Sign-Up)

**Endpoint**: `/users/register`  
**Método**: `POST`  
**Descripción**: Permite registrar a un nuevo usuario.

**Cuerpo de la Solicitud**:
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseñasegura",
  "name": "John Doe"
}
```

---

### Iniciar Sesión

**Endpoint**: `/auth/login`  
**Método**: `POST`  
**Descripción**: Inicia sesión de un usuario y devuelve un token JWT.

**Cuerpo de la Solicitud**:
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseñasegura"
}
```

**Respuesta**:
```json
{
  "access_token": "<tu-token-jwt>"
}
```

---

## 🤖 Endpoints de la API

### Listar Todas las Películas

**Endpoint**: `/movies`  
**Método**: `GET`  
**Descripción**: Devuelve una lista de todas las películas. Accesible para todos los usuarios.

---

### Obtener Película por SLUG

**Endpoint**: `/movies/:slug`  
**Método**: `GET`  
**Descripción**: Obtiene los detalles de una película específica por su slug.  
**Autorización**: Requiere rol de "Usuario Regular" o "Admin".

---

### Crear una Nueva Película

**Endpoint**: `/movies`  
**Método**: `POST`  
**Descripción**: Crea una nueva película.  
**Autorización**: Requiere rol de "Admin".

**Cuerpo de la Solicitud**:
```json
{
  "title": "Nueva Película",
  "director": "Nombre del Director",
  "releaseDate": "2024-10-18",
  "description": "Descripción de la película",
  "genres": ["Acción", "Aventura"]
}
```

---

### Actualizar Película

**Endpoint**: `/movies/:slug`  
**Método**: `PATCH`  
**Descripción**: Actualiza los detalles de una película existente.  
**Autorización**: Requiere rol de "Admin".

**Cuerpo de la Solicitud**:
```json
{
  "title": "Nuevo Título de Película",
  "description": "Nueva descripción",
  "genres": ["Acción", "Drama"]
}
```

---

### Eliminar Película

**Endpoint**: `/movies/:slug`  
**Método**: `DELETE`  
**Descripción**: Elimina una película por su Slug.  
**Autorización**: Requiere rol de "Admin".

---

### Sincronizar Películas de Star Wars

**Endpoint**: `/movies/sync-star-wars`  
**Método**: `POST`  
**Descripción**: Sincroniza las películas de la API de Star Wars y las almacena en la base de datos.  
**Autorización**: Requiere rol de "Admin".

---

## 💡 Pruebas Unitarias

Para garantizar el correcto funcionamiento de la API, se escribieron pruebas unitarias que verifican:

- El correcto registro de usuarios.
- La autenticación con JWT.
- Las restricciones de acceso basadas en roles.
- Las operaciones CRUD en las películas.

---

## 🤝 Documentación con Swagger

La API está documentada usando **Swagger**. Para acceder a la documentación completa, una vez que la aplicación esté en funcionamiento, navega a:

- `http://localhost:3000/api-docs`

Allí, puedes visualizar y probar todos los endpoints disponibles.
