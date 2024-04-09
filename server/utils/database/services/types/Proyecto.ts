import type { Colaboracion } from './Colaboracion';
import type { Partenariado } from './Partenariado';
import type { ForeignKey, GetCreateType, GetType, PrimaryKey, VarChar } from './base/Shared';

export interface Proyecto {
	/** Foreign key of {@linkcode Colaboracion.id} */
	id: PrimaryKey<ForeignKey<Colaboracion, 'id'>>;
	/** Foreign key of {@linkcode Partenariado.id} */
	id_partenariado: ForeignKey<Partenariado, 'id'>;
	estado: ProyectoEstado;
	url: VarChar<200>;
}

export namespace Proyecto {
	export const Name = 'proyecto';

	export interface Value extends GetType<Proyecto> {}
	export interface CreateData extends GetCreateType<Proyecto> {}
}

export enum ProyectoEstado {
	EnCreacion = 'EN_CREACION',
	AbiertoProfesores = 'ABIERTO_PROFESORES',
	AbiertoEstudiantes = 'ABIERTO_ESTUDIANTES',
	EnCurso = 'EN_CURSO',
	Cerrado = 'CERRADO'
}
