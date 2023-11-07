import TAnuncioServicio from './tAnuncioServicio';
interface TOfertaServicio extends TAnuncioServicio {
    asignatura_objetivo: string;
    cuatrimestre: string;
    anio_academico: string;
    fecha_limite: Date;
    observaciones_temporales: string;
    creador: string;
    profesores: string[];
    tags: string[];
}

export default TOfertaServicio;