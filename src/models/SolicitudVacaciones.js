class SolicitudVacaciones {
  static ESTADO = {
    PENDIENTE: 'pendiente',
    APROBADA: 'aprobada',
    RECHAZADA: 'rechazada'
  };

  static TIPO = {
    DIA: 'dia',
    HORA: 'hora'
  };

  constructor(id, codigoTrabajador, tipo, fechaInicio, fechaFin, cantidadSolicitada, motivo = '') {
    this.id = id;
    this.codigoTrabajador = codigoTrabajador;
    this.tipo = tipo;
    this.fechaInicio = new Date(fechaInicio);
    this.fechaFin = new Date(fechaFin);
    this.cantidadSolicitada = cantidadSolicitada;
    this.motivo = motivo;
    this.estado = SolicitudVacaciones.ESTADO.PENDIENTE;
    this.fechaSolicitud = new Date();
    this.aprobadoPor = null;
    this.fechaRevision = null;
    this.comentarioRevision = '';
  }

  aprobar(aprobadoPor, comentario = '') {
    this.estado = SolicitudVacaciones.ESTADO.APROBADA;
    this.aprobadoPor = aprobadoPor;
    this.fechaRevision = new Date();
    this.comentarioRevision = comentario;
  }

  rechazar(rechazadoPor, comentario = '') {
    this.estado = SolicitudVacaciones.ESTADO.RECHAZADA;
    this.aprobadoPor = rechazadoPor;
    this.fechaRevision = new Date();
    this.comentarioRevision = comentario;
  }

  calcularDiasHabiles() {
    if (this.tipo === SolicitudVacaciones.TIPO.HORA) {
      return this.cantidadSolicitada / 8;
    }
    return this.cantidadSolicitada;
  }
}

module.exports = SolicitudVacaciones;
