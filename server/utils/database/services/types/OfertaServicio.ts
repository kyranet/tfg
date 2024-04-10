import type { AnuncioServicio } from './AnuncioServicio';
import type { ProfesorInterno } from './ProfesorInterno';
import {
	makeKeyFunction,
	type Defaults,
	type ForeignKey,
	type GetCreateType,
	type GetType,
	type Int,
	type PrimaryKey,
	type VarChar
} from './base/Shared';

export interface OfertaServicio {
	/** Foreign key of {@linkcode AnuncioServicio.id} */
	id: PrimaryKey<ForeignKey<AnuncioServicio, 'id'>>;
	cuatrimestre: Defaults<Int | null>;
	anio_academico: Defaults<Int | null>;
	fecha_limite: Defaults<Date | null>;
	observaciones_temporales: Defaults<VarChar<1200> | null>;
	/** Foreign key of {@linkcode ProfesorInterno.id} */
	creador: ForeignKey<ProfesorInterno, 'id'>;
}

export namespace OfertaServicio {
	export const Name = 'oferta_servicio';
	export const Key = makeKeyFunction(Name);

	export interface Value extends GetType<OfertaServicio> {}
	export interface CreateData extends GetCreateType<OfertaServicio> {}
}
