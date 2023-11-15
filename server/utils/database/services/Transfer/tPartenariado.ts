import type TColaboracion from './tColaboracion';

interface tPartenariado extends TColaboracion {
	id_demanda: number;
	id_oferta: number;
	status: string;
	id: number;
	titulo: string;
	descripcion: string;
	admite_externos: boolean;
	responsable: string;
	profesores: string[];
}

export default tPartenariado;
