require('dotenv').config();
const app = require('./app');
const { testConnection } = require('./config/database');

const PORT = process.env.PORT || 3000;

async function iniciarServidor() {
  const conectado = await testConnection();
  
  if (!conectado) {
    console.error('\n  No se pudo conectar a MySQL.');
    console.error('Por favor, verifica:');
    console.error('1. MySQL está corriendo en localhost:3306');
    console.error('2. El archivo .env tiene las credenciales correctas');
    console.error('3. La base de datos "gestion_vacaciones" existe (ejecuta database/schema.sql)');
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`\n Servidor corriendo en http://localhost:${PORT}`);
    console.log(` API disponible en http://localhost:${PORT}/api`);
    console.log(` Base de datos: MySQL - ${process.env.DB_NAME}`);
    console.log('\nEndpoints principales:');
    console.log('  POST   /api/solicitudes - Crear solicitud de vacaciones');
    console.log('  PATCH  /api/solicitudes/:id/aprobar - Aprobar solicitud');
    console.log('  PATCH  /api/solicitudes/:id/rechazar - Rechazar solicitud');
    console.log('  GET    /api/trabajadores - Listar trabajadores');
  });
}

iniciarServidor();
