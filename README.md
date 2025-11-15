# Sistema de Gestión de Vacaciones

API REST para gestionar solicitudes de vacaciones de trabajadores.

##  Base de Datos

La aplicación usa **MySQL** para persistencia de datos.

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar MySQL

#### a) Configurar credenciales
Edita el archivo `.env` con tus credenciales de MySQL:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password_aqui
DB_NAME=gestion_vacaciones
PORT=3000
```

#### b) Crear base de datos


### 3. Iniciar servidor

```bash
# Modo desarrollo con auto-reload
npm run dev

# Modo producción
npm start
```

El servidor se ejecutará en `http://localhost:3000`

Si la conexión es exitosa verás:
```
 Conexión exitosa a MySQL
Servidor corriendo en http://localhost:3000
Base de datos: MySQL - gestion_vacaciones
```

## Endpoints de la API

### Trabajadores

#### Crear trabajador
```http
POST /api/trabajadores

{
  "codigoInterno": "T004",
  "cedula": "12345678",
  "nombreCompleto": "Juan Pérez",
  "fechaIngreso": "2020-01-15",
  "area": "Recursos Humanos",
  "cargo": "Analista"
}
```

#### Listar trabajadores
```http
GET /api/trabajadores
```

#### Obtener trabajador por código
```http
GET /api/trabajadores/:codigoInterno
```

#### Obtener historial de vacaciones
```http
GET /api/trabajadores/:codigoInterno/historial
```

### Solicitudes de Vacaciones

#### Crear solicitud de vacaciones
```http
POST /api/solicitudes

{
  "codigoTrabajador": "T001",
  "tipo": "dia",
  "fechaInicio": "2025-12-20",
  "fechaFin": "2025-12-27",
  "cantidadSolicitada": 5,
  "motivo": "Vacaciones de fin de año"
}
```

Tipos disponibles: `"dia"` o `"hora"`

#### Listar todas las solicitudes
```http
GET /api/solicitudes
```

#### Obtener solicitud por ID
```http
GET /api/solicitudes/:id
```

#### Aprobar solicitud
```http
PATCH /api/solicitudes/:id/aprobar

{
  "aprobadoPor": "admin001",
  "comentario": "Aprobado"
}
```

#### Rechazar solicitud
```http
PATCH /api/solicitudes/:id/rechazar

{
  "rechazadoPor": "admin001",
  "comentario": "No hay disponibilidad en esas fechas"
}
```

## Datos de Ejemplo

El script SQL incluye 3 trabajadores de ejemplo:
- **T001**: Juan Pérez García (Recursos Humanos) - Antigüedad: ~5 años → 15 días
- **T002**: María López Rodríguez (Tecnología) - Antigüedad: ~10 años → 20 días
- **T003**: Carlos Martínez Silva (Finanzas) - Antigüedad: ~15 años → 25 días

## Reglas de Negocio

### Días de Vacaciones por Antigüedad
- **Menos de 1 año**: 15 días
- **1-4 años**: 15 días
- **5-9 años**: 20 días
- **10+ años**: 25 días

### Estados de Solicitud
- `pendiente`: Solicitud creada, esperando revisión
- `aprobada`: Solicitud aprobada por administrador
- `rechazada`: Solicitud rechazada por administrador

### Validaciones
- No se pueden solicitar más días de los disponibles
- Solo se pueden aprobar/rechazar solicitudes en estado pendiente
- Las solicitudes por hora se convierten a días (8 horas = 1 día)
