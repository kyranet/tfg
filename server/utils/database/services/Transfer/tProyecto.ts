import type TColaboracion from './tColaboracion';

interface tProyecto extends TColaboracion {
	id: number;
	id_partenariado: number;
	estado: string;
	estudiantes: string[];
	titulo: string;
	descripcion: string;
	admite_externos: boolean;
	responsable: string;
	profesores: string[];
}

export default tProyecto;
