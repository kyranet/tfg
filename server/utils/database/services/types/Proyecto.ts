import type { Colaboracion } from './Colaboracion';

export interface Proyecto extends Colaboracion {
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
