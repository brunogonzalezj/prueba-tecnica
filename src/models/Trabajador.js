class Trabajador {
  constructor(codigoInterno, cedula, nombreCompleto, fechaIngreso, area, cargo) {
    this.codigoInterno = codigoInterno;
    this.cedula = cedula;
    this.nombreCompleto = nombreCompleto;
    this.fechaIngreso = new Date(fechaIngreso);
    this.area = area;
    this.cargo = cargo;
  }

  calcularAntiguedad() {
    const ahora = new Date();
    const diffTiempo = ahora - this.fechaIngreso;
    const diffAnios = Math.floor(diffTiempo / (1000 * 60 * 60 * 24 * 365.25));
    return diffAnios;
  }

  calcularDiasDisponibles() {
    const antiguedad = this.calcularAntiguedad();
    
    if (antiguedad < 1) return 15;
    if (antiguedad >= 1 && antiguedad < 5) return 15;
    if (antiguedad >= 5 && antiguedad < 10) return 20;
    if (antiguedad >= 10) return 25;
    
    return 15;
  }
}

module.exports = Trabajador;
