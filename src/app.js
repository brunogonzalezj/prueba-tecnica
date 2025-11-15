const express = require('express');
const cors = require('cors');
const trabajadoresRoutes = require('./routes/trabajadores');
const solicitudesRoutes = require('./routes/solicitudes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/trabajadores', trabajadoresRoutes);
app.use('/api/solicitudes', solicitudesRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

module.exports = app;
