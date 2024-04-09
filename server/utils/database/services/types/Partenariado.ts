import type { Colaboracion } from './Colaboracion';

export interface Partenariado extends Colaboracion {
	id: number;
	id_demanda: number;
	id_oferta: number;
	estado: PartenariadoStatus;
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
