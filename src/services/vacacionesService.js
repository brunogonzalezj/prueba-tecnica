const SolicitudVacaciones = require('../models/SolicitudVacaciones');
const Trabajador = require('../models/Trabajador');
const db = require('../data/database');

async function crearSolicitudVacaciones(datos) {
  const { codigoTrabajador, tipo, fechaInicio, fechaFin, cantidadSolicitada, motivo } = datos;

  const trabajadorData = await db.obtenerTrabajador(codigoTrabajador);
  if (!trabajadorData) {
    throw new Error('Trabajador no encontrado');
  }

  const trabajador = new Trabajador(
    trabajadorData.codigoInterno,
    trabajadorData.cedula,
    trabajadorData.nombreCompleto,
    trabajadorData.fechaIngreso,
    trabajadorData.area,
    trabajadorData.cargo
  );

  const diasDisponibles = await calcularDiasDisponibles(codigoTrabajador);
  const diasSolicitados = tipo === 'hora' ? cantidadSolicitada / 8 : cantidadSolicitada;

  if (diasSolicitados > diasDisponibles) {
    throw new Error(`No hay suficientes días disponibles. Disponibles: ${diasDisponibles}, Solicitados: ${diasSolicitados}`);
  }

  const solicitud = new SolicitudVacaciones(
    null,
    codigoTrabajador,
    tipo,
    fechaInicio,
    fechaFin,
    cantidadSolicitada,
    motivo
  );

  return await db.agregarSolicitud(solicitud);
}

async function aprobarSolicitud(idSolicitud, aprobadoPor, comentario = '') {
  const solicitud = await db.obtenerSolicitud(idSolicitud);
  
  if (!solicitud) {
    throw new Error('Solicitud no encontrada');
  }

  if (solicitud.estado !== SolicitudVacaciones.ESTADO.PENDIENTE) {
    throw new Error('Solo se pueden aprobar solicitudes pendientes');
  }

  await db.actualizarEstadoSolicitud(
    idSolicitud, 
    SolicitudVacaciones.ESTADO.APROBADA, 
    aprobadoPor, 
    comentario
  );

  return await db.obtenerSolicitud(idSolicitud);
}

async function rechazarSolicitud(idSolicitud, rechazadoPor, comentario = '') {
  const solicitud = await db.obtenerSolicitud(idSolicitud);
  
  if (!solicitud) {
    throw new Error('Solicitud no encontrada');
  }

  if (solicitud.estado !== SolicitudVacaciones.ESTADO.PENDIENTE) {
    throw new Error('Solo se pueden rechazar solicitudes pendientes');
  }

  await db.actualizarEstadoSolicitud(
    idSolicitud, 
    SolicitudVacaciones.ESTADO.RECHAZADA, 
    rechazadoPor, 
    comentario
  );

  return await db.obtenerSolicitud(idSolicitud);
}

async function calcularDiasDisponibles(codigoTrabajador) {
  const trabajadorData = await db.obtenerTrabajador(codigoTrabajador);
  if (!trabajadorData) {
    throw new Error('Trabajador no encontrado');
  }

  const trabajador = new Trabajador(
    trabajadorData.codigoInterno,
    trabajadorData.cedula,
    trabajadorData.nombreCompleto,
    trabajadorData.fechaIngreso,
    trabajadorData.area,
    trabajadorData.cargo
  );

  const diasTotales = trabajador.calcularDiasDisponibles();
  const solicitudes = await db.obtenerSolicitudesPorTrabajador(codigoTrabajador);
  const solicitudesAprobadas = solicitudes.filter(sol => sol.estado === SolicitudVacaciones.ESTADO.APROBADA);

  const diasUsados = solicitudesAprobadas.reduce((total, sol) => {
    const dias = sol.tipo === 'hora' ? sol.cantidadSolicitada / 8 : sol.cantidadSolicitada;
    return total + dias;
  }, 0);

  return diasTotales - diasUsados;
}

async function obtenerHistorialTrabajador(codigoTrabajador) {
  const trabajadorData = await db.obtenerTrabajador(codigoTrabajador);
  if (!trabajadorData) {
    throw new Error('Trabajador no encontrado');
  }

  const trabajador = new Trabajador(
    trabajadorData.codigoInterno,
    trabajadorData.cedula,
    trabajadorData.nombreCompleto,
    trabajadorData.fechaIngreso,
    trabajadorData.area,
    trabajadorData.cargo
  );

  const solicitudes = await db.obtenerSolicitudesPorTrabajador(codigoTrabajador);
  const diasTotales = trabajador.calcularDiasDisponibles();
  const diasDisponibles = await calcularDiasDisponibles(codigoTrabajador);
  const diasUsados = diasTotales - diasDisponibles;

  return {
    trabajador: {
      codigoInterno: trabajador.codigoInterno,
      nombreCompleto: trabajador.nombreCompleto,
      antiguedad: trabajador.calcularAntiguedad()
    },
    resumen: {
      diasTotales,
      diasUsados,
      diasDisponibles
    },
    solicitudes: solicitudes.map(sol => ({
      id: sol.id,
      tipo: sol.tipo,
      fechaInicio: sol.fechaInicio,
      fechaFin: sol.fechaFin,
      cantidadSolicitada: sol.cantidadSolicitada,
      estado: sol.estado,
      fechaSolicitud: sol.fechaSolicitud,
      aprobadoPor: sol.aprobadoPor,
      fechaRevision: sol.fechaRevision,
      comentarioRevision: sol.comentarioRevision
    }))
  };
}

module.exports = {
  crearSolicitudVacaciones,
  aprobarSolicitud,
  rechazarSolicitud,
  calcularDiasDisponibles,
  obtenerHistorialTrabajador
};
