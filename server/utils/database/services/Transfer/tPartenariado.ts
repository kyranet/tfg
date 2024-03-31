import type TColaboracion from './tColaboracion';

interface tPartenariado extends TColaboracion {
	id: number;
	id_demanda: number;
	id_oferta: number;
	status: string;
	titulo: string;
	descripcion: string;
	admite_externos: boolean;
	responsable: string;
	profesores: string[];
}

export default tPartenariado;
