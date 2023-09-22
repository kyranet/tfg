class TIniciativa {
    id;
    titulo;
    descripcion;
    necesidad_social;
    demanda;
    area_servicio;
    estudiante;

    constructor(id, titulo, descripcion, necesidad_social, demanda, area_servicio, estudiante) {
        this.id = id;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.necesidad_social = necesidad_social;
        this.demanda = demanda;
        this.area_servicio = area_servicio;
        this.estudiante = estudiante;
    }

    getId() {
        return this.id;
    }

    setId(id) {
        this.id = id;
    }

    getTitulo() {
        return this.titulo;
    }

    setTitulo(titulo) {
        this.titulo = titulo;
    }

    getDescripcion() {
        return this.descripcion;
    }

    setDescripcion(descripcion) {
        this.descripcion = descripcion;
    }

    getNecesidad_social() {
        return this.necesidad_social;
    }

    setNecesidad_social(necesidad_social) {
        this.necesidad_social = necesidad_social;
    }

    getDemanda() {
        return this.demanda;
    }

    setDemanda(demanda) {
        this.demanda = demanda;
    }

    getArea_servicio() {
        return this.area_servicio;
    }

    setArea_servicio(area_servicio) {
        this.area_servicio = area_servicio;
    }

    getDemanda_servicio() {
        return this.demanda_servicio;
    }

    setDemanda_servicio(demanda_servicio) {
        this.demanda_servicio = demanda_servicio;
    }

    getEstudiante() {
        return this.estudiante;
    }

    setEstudiante(estudiante) {
        this.estudiante = estudiante;
    }
}
module.exports = TIniciativa;