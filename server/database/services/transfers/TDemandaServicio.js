const TAnuncioServicio = require('./TAnuncioServicio');

class TDemandaServicio extends TAnuncioServicio{
    creador;
    ciudad;
    finalidad;
    periodo_definicion_ini;
    periodo_definicion_fin;
    periodo_ejecucion_ini;
    periodo_ejecucion_fin;
    fecha_fin;
    observaciones_temporales;
    necesidad_social;
    titulacionlocal;
    comunidad_beneficiaria;
    dummy;


    constructor( id_demanda, titulo, descripcion, imagen, created_at, updated_at,
        creador, ciudad, finalidad, periodo_definicion_ini, periodo_definicion_fin, periodo_ejecucion_ini,
        periodo_ejecucion_fin, fecha_fin, observaciones_temporales, necesidad_social, titulacionlocal,
        area_servicio, comunidad_beneficiaria, dummy)
    {
        super(id_demanda, titulo, descripcion, imagen, created_at, updated_at, area_servicio, dummy);
        this.creador = creador;
        this.ciudad = ciudad;
        this.finalidad = finalidad;
        this.periodo_definicion_ini = periodo_definicion_ini;
        this.periodo_definicion_fin = periodo_definicion_fin;
        this.periodo_ejecucion_ini = periodo_ejecucion_ini;
        this.periodo_ejecucion_fin = periodo_ejecucion_fin;
        this.fecha_fin = fecha_fin;
        this.observaciones_temporales = observaciones_temporales;
        this.necesidad_social = necesidad_social;
        this.titulacionlocal = titulacionlocal;
        this.comunidad_beneficiaria = comunidad_beneficiaria;
        this.dummy = dummy;
    }

    getCreador() {
        return this.creador;
    }

    setCreador(creador) {
        this.creador = creador;
    }

    getCiudad() {
        return this.ciudad;
    }

    setCiudad(ciudad) {
        this.ciudad = ciudad;
    }

    getFinalidad() {
        return this.finalidad;
    }
    getComunidad_Beneficiaria() {
        return this.comunidad_beneficiaria;
    }

    setFinalidad(finalidad) {
        this.finalidad = finalidad;
    }

    getPeriodo_definicion_ini() {
        return this.periodo_definicion_ini;
    }

    setPeriodo_definicion_ini(periodo_definicion_ini) {
        this.periodo_definicion_ini = periodo_definicion_ini;
    }

    getPeriodo_definicion_fin() {
        return this.periodo_definicion_fin;
    }

    setPeriodo_definicion_fin(periodo_definicion_fin) {
        this.periodo_definicion_fin = periodo_definicion_fin;
    }

    getPeriodo_ejecucion_ini() {
        return this.periodo_ejecucion_ini;
    }

    setPeriodo_ejecucion_ini(periodo_ejecucion_ini) {
        this.periodo_ejecucion_ini = periodo_ejecucion_ini;
    }

    getPeriodo_ejecucion_fin() {
        return this.periodo_ejecucion_fin;
    }

    setPeriodo_ejecucion_fin(periodo_ejecucion_fin) {
        this.periodo_ejecucion_fin = periodo_ejecucion_fin;
    }

    getFecha_fin() {
        return this.fecha_fin;
    }

    setFecha_fin(fecha_fin) {
        this.fecha_fin = fecha_fin;
    }

    getFecha_fin() {
        return this.fecha_fin;
    }

    setFecha_fin(fecha_fin) {
        this.fecha_fin = fecha_fin;
    }

    getObservaciones_temporales() {
        return this.observaciones_temporales;
    }

    setObservaciones_temporales(observaciones_temporales) {
        this.observaciones_temporales = observaciones_temporales;
    }

    getNecesidad_social() {
        return this.necesidad_social;
    }

    setNecesidad_social(necesidad_social) {
        this.necesidad_social = necesidad_social;
    }

    getTitulacionlocal_demandada() {
        return this.titulacionlocal;
    }

    setTitulacionlocal_demandada(titulacionlocal) {
        this.titulacionlocal = titulacionlocal;
    }


}

module.exports = TDemandaServicio;
