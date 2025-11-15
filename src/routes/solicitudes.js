const express = require('express');
const router = express.Router();
const vacacionesService = require('../services/vacacionesService');
const db = require('../data/database');

router.post('/', async (req, res) => {
  try {
    const { codigoTrabajador, tipo, fechaInicio, fechaFin, cantidadSolicitada, motivo } = req.body;

    if (!codigoTrabajador || !tipo || !fechaInicio || !fechaFin || !cantidadSolicitada) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    if (tipo !== 'dia' && tipo !== 'hora') {
      return res.status(400).json({ error: 'El tipo debe ser "dia" o "hora"' });
    }

    const solicitud = await vacacionesService.crearSolicitudVacaciones({
      codigoTrabajador,
      tipo,
      fechaInicio,
      fechaFin,
      cantidadSolicitada,
      motivo: motivo || ''
    });

    res.status(201).json({
      mensaje: 'Solicitud de vacaciones creada exitosamente',
      solicitud: {
        id: solicitud.id,
        codigoTrabajador: solicitud.codigoTrabajador,
        tipo: solicitud.tipo,
        fechaInicio: solicitud.fechaInicio,
        fechaFin: solicitud.fechaFin,
        cantidadSolicitada: solicitud.cantidadSolicitada,
        motivo: solicitud.motivo,
        estado: solicitud.estado,
        fechaSolicitud: solicitud.fechaSolicitud
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const solicitudes = await db.obtenerTodasSolicitudes();
    res.json({
      total: solicitudes.length,
      solicitudes: solicitudes.map(sol => ({
        id: sol.id,
        codigoTrabajador: sol.codigoTrabajador,
        tipo: sol.tipo,
        fechaInicio: sol.fechaInicio,
        fechaFin: sol.fechaFin,
        cantidadSolicitada: sol.cantidadSolicitada,
        estado: sol.estado,
        fechaSolicitud: sol.fechaSolicitud,
        aprobadoPor: sol.aprobadoPor,
        fechaRevision: sol.fechaRevision
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const solicitud = await db.obtenerSolicitud(parseInt(req.params.id));
    
    if (!solicitud) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }

    res.json({
      id: solicitud.id,
      codigoTrabajador: solicitud.codigoTrabajador,
      tipo: solicitud.tipo,
      fechaInicio: solicitud.fechaInicio,
      fechaFin: solicitud.fechaFin,
      cantidadSolicitada: solicitud.cantidadSolicitada,
      motivo: solicitud.motivo,
      estado: solicitud.estado,
      fechaSolicitud: solicitud.fechaSolicitud,
      aprobadoPor: solicitud.aprobadoPor,
      fechaRevision: solicitud.fechaRevision,
      comentarioRevision: solicitud.comentarioRevision
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/:id/aprobar', async (req, res) => {
  try {
    const { aprobadoPor, comentario } = req.body;

    if (!aprobadoPor) {
      return res.status(400).json({ error: 'Se requiere el campo aprobadoPor' });
    }

    const solicitud = await vacacionesService.aprobarSolicitud(
      parseInt(req.params.id),
      aprobadoPor,
      comentario || ''
    );

    res.json({
      mensaje: 'Solicitud aprobada exitosamente',
      solicitud: {
        id: solicitud.id,
        codigoTrabajador: solicitud.codigoTrabajador,
        estado: solicitud.estado,
        aprobadoPor: solicitud.aprobadoPor,
        fechaRevision: solicitud.fechaRevision,
        comentarioRevision: solicitud.comentarioRevision
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.patch('/:id/rechazar', async (req, res) => {
  try {
    const { rechazadoPor, comentario } = req.body;

    if (!rechazadoPor) {
      return res.status(400).json({ error: 'Se requiere el campo rechazadoPor' });
    }

    const solicitud = await vacacionesService.rechazarSolicitud(
      parseInt(req.params.id),
      rechazadoPor,
      comentario || ''
    );

    res.json({
      mensaje: 'Solicitud rechazada',
      solicitud: {
        id: solicitud.id,
        codigoTrabajador: solicitud.codigoTrabajador,
        estado: solicitud.estado,
        aprobadoPor: solicitud.aprobadoPor,
        fechaRevision: solicitud.fechaRevision,
        comentarioRevision: solicitud.comentarioRevision
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
