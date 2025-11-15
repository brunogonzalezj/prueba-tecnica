const { pool } = require('../config/database');

async function agregarTrabajador(trabajador) {
  const query = `
    INSERT INTO trabajadores (codigo_interno, cedula, nombre_completo, fecha_ingreso, area, cargo)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  
  const [result] = await pool.execute(query, [
    trabajador.codigoInterno,
    trabajador.cedula,
    trabajador.nombreCompleto,
    trabajador.fechaIngreso,
    trabajador.area,
    trabajador.cargo
  ]);
  
  return trabajador;
}

async function obtenerTrabajador(codigoInterno) {
  const query = 'SELECT * FROM trabajadores WHERE codigo_interno = ?';
  const [rows] = await pool.execute(query, [codigoInterno]);
  
  if (rows.length === 0) return null;
  
  const row = rows[0];
  return {
    codigoInterno: row.codigo_interno,
    cedula: row.cedula,
    nombreCompleto: row.nombre_completo,
    fechaIngreso: row.fecha_ingreso,
    area: row.area,
    cargo: row.cargo
  };
}

async function obtenerTodosTrabajadores() {
  const query = 'SELECT * FROM trabajadores ORDER BY codigo_interno';
  const [rows] = await pool.execute(query);
  
  return rows.map(row => ({
    codigoInterno: row.codigo_interno,
    cedula: row.cedula,
    nombreCompleto: row.nombre_completo,
    fechaIngreso: row.fecha_ingreso,
    area: row.area,
    cargo: row.cargo
  }));
}

async function agregarSolicitud(solicitud) {
  const query = `
    INSERT INTO solicitudes_vacaciones 
    (codigo_trabajador, tipo, fecha_inicio, fecha_fin, cantidad_solicitada, motivo, estado, fecha_solicitud)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  const [result] = await pool.execute(query, [
    solicitud.codigoTrabajador,
    solicitud.tipo,
    solicitud.fechaInicio,
    solicitud.fechaFin,
    solicitud.cantidadSolicitada,
    solicitud.motivo,
    solicitud.estado,
    solicitud.fechaSolicitud
  ]);
  
  solicitud.id = result.insertId;
  return solicitud;
}

async function obtenerSolicitud(id) {
  const query = 'SELECT * FROM solicitudes_vacaciones WHERE id = ?';
  const [rows] = await pool.execute(query, [id]);
  
  if (rows.length === 0) return null;
  
  const row = rows[0];
  return {
    id: row.id,
    codigoTrabajador: row.codigo_trabajador,
    tipo: row.tipo,
    fechaInicio: row.fecha_inicio,
    fechaFin: row.fecha_fin,
    cantidadSolicitada: parseFloat(row.cantidad_solicitada),
    motivo: row.motivo,
    estado: row.estado,
    fechaSolicitud: row.fecha_solicitud,
    aprobadoPor: row.aprobado_por,
    fechaRevision: row.fecha_revision,
    comentarioRevision: row.comentario_revision
  };
}

async function obtenerTodasSolicitudes() {
  const query = 'SELECT * FROM solicitudes_vacaciones ORDER BY fecha_solicitud DESC';
  const [rows] = await pool.execute(query);
  
  return rows.map(row => ({
    id: row.id,
    codigoTrabajador: row.codigo_trabajador,
    tipo: row.tipo,
    fechaInicio: row.fecha_inicio,
    fechaFin: row.fecha_fin,
    cantidadSolicitada: parseFloat(row.cantidad_solicitada),
    motivo: row.motivo,
    estado: row.estado,
    fechaSolicitud: row.fecha_solicitud,
    aprobadoPor: row.aprobado_por,
    fechaRevision: row.fecha_revision,
    comentarioRevision: row.comentario_revision
  }));
}

async function obtenerSolicitudesPorTrabajador(codigoTrabajador) {
  const query = `
    SELECT * FROM solicitudes_vacaciones 
    WHERE codigo_trabajador = ? 
    ORDER BY fecha_solicitud DESC
  `;
  const [rows] = await pool.execute(query, [codigoTrabajador]);
  
  return rows.map(row => ({
    id: row.id,
    codigoTrabajador: row.codigo_trabajador,
    tipo: row.tipo,
    fechaInicio: row.fecha_inicio,
    fechaFin: row.fecha_fin,
    cantidadSolicitada: parseFloat(row.cantidad_solicitada),
    motivo: row.motivo,
    estado: row.estado,
    fechaSolicitud: row.fecha_solicitud,
    aprobadoPor: row.aprobado_por,
    fechaRevision: row.fecha_revision,
    comentarioRevision: row.comentario_revision
  }));
}

async function actualizarEstadoSolicitud(id, estado, aprobadoPor, comentario) {
  const query = `
    UPDATE solicitudes_vacaciones 
    SET estado = ?, aprobado_por = ?, fecha_revision = NOW(), comentario_revision = ?
    WHERE id = ?
  `;
  
  const [result] = await pool.execute(query, [estado, aprobadoPor, comentario, id]);
  return result.affectedRows > 0;
}

module.exports = {
  agregarTrabajador,
  obtenerTrabajador,
  obtenerTodosTrabajadores,
  agregarSolicitud,
  obtenerSolicitud,
  obtenerTodasSolicitudes,
  obtenerSolicitudesPorTrabajador,
  actualizarEstadoSolicitud
};
