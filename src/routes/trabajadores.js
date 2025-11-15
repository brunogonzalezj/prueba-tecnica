const express = require('express');
const router = express.Router();
const Trabajador = require('../models/Trabajador');
const db = require('../data/database');
const vacacionesService = require('../services/vacacionesService');

router.post('/', async (req, res) => {
  try {
    const { codigoInterno, cedula, nombreCompleto, fechaIngreso, area, cargo } = req.body;

    if (!codigoInterno || !cedula || !nombreCompleto || !fechaIngreso || !area || !cargo) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    const existe = await db.obtenerTrabajador(codigoInterno);
    if (existe) {
      return res.status(400).json({ error: 'Ya existe un trabajador con ese código interno' });
    }

    const trabajador = new Trabajador(codigoInterno, cedula, nombreCompleto, fechaIngreso, area, cargo);
    await db.agregarTrabajador(trabajador);

    res.status(201).json({
      mensaje: 'Trabajador creado exitosamente',
      trabajador: {
        codigoInterno: trabajador.codigoInterno,
        cedula: trabajador.cedula,
        nombreCompleto: trabajador.nombreCompleto,
        fechaIngreso: trabajador.fechaIngreso,
        area: trabajador.area,
        cargo: trabajador.cargo,
        antiguedad: trabajador.calcularAntiguedad(),
        diasVacacionesDisponibles: trabajador.calcularDiasDisponibles()
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const trabajadoresData = await db.obtenerTodosTrabajadores();
    const trabajadores = trabajadoresData.map(t => new Trabajador(
      t.codigoInterno,
      t.cedula,
      t.nombreCompleto,
      t.fechaIngreso,
      t.area,
      t.cargo
    ));
    
    res.json({
      total: trabajadores.length,
      trabajadores: trabajadores.map(t => ({
        codigoInterno: t.codigoInterno,
        cedula: t.cedula,
        nombreCompleto: t.nombreCompleto,
        fechaIngreso: t.fechaIngreso,
        area: t.area,
        cargo: t.cargo,
        antiguedad: t.calcularAntiguedad(),
        diasVacacionesDisponibles: t.calcularDiasDisponibles()
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:codigoInterno', async (req, res) => {
  try {
    const trabajadorData = await db.obtenerTrabajador(req.params.codigoInterno);
    
    if (!trabajadorData) {
      return res.status(404).json({ error: 'Trabajador no encontrado' });
    }

    const trabajador = new Trabajador(
      trabajadorData.codigoInterno,
      trabajadorData.cedula,
      trabajadorData.nombreCompleto,
      trabajadorData.fechaIngreso,
      trabajadorData.area,
      trabajadorData.cargo
    );

    res.json({
      codigoInterno: trabajador.codigoInterno,
      cedula: trabajador.cedula,
      nombreCompleto: trabajador.nombreCompleto,
      fechaIngreso: trabajador.fechaIngreso,
      area: trabajador.area,
      cargo: trabajador.cargo,
      antiguedad: trabajador.calcularAntiguedad(),
      diasVacacionesDisponibles: trabajador.calcularDiasDisponibles()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:codigoInterno/historial', async (req, res) => {
  try {
    const historial = await vacacionesService.obtenerHistorialTrabajador(req.params.codigoInterno);
    res.json(historial);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;
