import { AnuncioServicio } from './AnuncioServicio';
import { ProfesorInterno } from './ProfesorInterno';

export interface OfertaServicio extends AnuncioServicio {
	asignatura_objetivo: string[];
	cuatrimestre: string;
	anio_academico: string;
	fecha_limite: Date;
	observaciones_temporales: string;
	creador: string;
	profesores: ProfesorInterno[];
	tags: string[];
}
