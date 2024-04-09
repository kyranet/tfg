import TAnuncioServicio from './tAnuncioServicio';
import tProfesorInterno from './tProfesorInterno';
interface TOfertaServicio extends TAnuncioServicio {
	asignatura_objetivo: String[];
	cuatrimestre: string;
	anio_academico: string;
	fecha_limite: Date;
	observaciones_temporales: string;
	creador: string;
	profesores: tProfesorInterno[];
	tags: string[];
}

export default TOfertaServicio;
