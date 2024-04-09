import type TColaboracion from './tColaboracion';

export interface Partenariado extends TColaboracion {
	id: number;
	id_demanda: number;
	id_oferta: number;
	status: PartenariadoStatus;
	titulo: string;
	descripcion: string;
	admite_externos: boolean;
	responsable: string;
	profesores: string[];
}

export enum PartenariadoStatus {
	EnNegociacion = 'EN_NEGOCIACION',
	Acordado = 'ACORDADO',
	Suspendido = 'SUSPENDIDO',
	EnCreacion = 'EN_CREACION'
}
