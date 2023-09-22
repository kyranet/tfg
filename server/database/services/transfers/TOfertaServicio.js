const TAnuncioServicio = require('./TAnuncioServicio');
class TOfertaServicio extends TAnuncioServicio{
    asignatura_objetivo;
    cuatrimestre;
    anio_academico;
    fecha_limite;
    observaciones_temporales;
    creador;
    profesores;
    tags;
    constructor(id, titulo, descripcion, imagen, created_at, updated_at, asignatura_objetivo,
         cuatrimestre, anio_academico, fecha_limite, observaciones_temporales, creador, area_servicio, profesores, dummy, tags) 
    {
        super(id, titulo, descripcion, imagen, created_at, updated_at, area_servicio,dummy);
        this.asignatura_objetivo = asignatura_objetivo;
        this.cuatrimestre = cuatrimestre;
        this.anio_academico = anio_academico;
        this.fecha_limite = fecha_limite;
        this.observaciones_temporales = observaciones_temporales;
        this.creador = creador;
        this.profesores = profesores;
        this.tags = tags;
    }

    getAsignatura_objetivo() {
        return this.asignatura_objetivo;
    }

    setAsignatura_objetivo(asignatura_objetivo) {
        this.asignatura_objetivo = asignatura_objetivo;
    }

    getCuatrimestre() {
        return this.cuatrimestre;
    }

    setCuatrimestre(cuatrimestre) {
        this.cuatrimestre = cuatrimestre;
    }

    getAnio_academico() {
        return this.anio_academico;
    }

    setAnio_academico(anio_academico) {
        this.anio_academico = anio_academico;
    }

    getFecha_limite() {
        return this.fecha_limite;
    }

    setFecha_limite(fecha_limite) {
        this.fecha_limite = fecha_limite;
    }

    getObservaciones_temporales() {
        return this.observaciones_temporales;
    }

    setObservaciones_temporales(observaciones_temporales) {
        this.observaciones_temporales = observaciones_temporales;
    }

    getCreador() {
        return this.creador;
    }

    setCreador(creador) {
        this.creador = creador;
    }

    getProfesores() {
        return this.profesores;
    }

    setProfesores(profesores) {
        this.profesores = profesores;
    }
    getTags() {
        return this.profesores;
    }

    setTags(tags) {
        this.tags = tags;
    }
}

module.exports = TOfertaServicio;