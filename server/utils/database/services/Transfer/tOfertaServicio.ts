import TAnuncioServicio from './tAnuncioServicio';
import tProfesorInterno from './tProfesorInterno';

export interface OfertaServicio extends TAnuncioServicio {
	asignatura_objetivo: string[];
	cuatrimestre: string;
	anio_academico: string;
	fecha_limite: Date;
	observaciones_temporales: string;
	creador: string;
	profesores: tProfesorInterno[];
	tags: string[];
}
