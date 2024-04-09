import type { Colaboracion } from './Colaboracion';
import type { DemandaServicio } from './DemandaServicio';
import type { OfertaServicio } from './OfertaServicio';
import type { Defaults, ForeignKey, GetCreateType, GetType, PrimaryKey } from './base/Shared';

export interface Partenariado {
	/** Foreign key of {@linkcode Colaboracion.id} */
	id: PrimaryKey<ForeignKey<Colaboracion, 'id'>>;
	/** Foreign key of {@linkcode DemandaServicio.id} */
	id_demanda: ForeignKey<DemandaServicio, 'id'>;
	/** Foreign key of {@linkcode OfertaServicio.id} */
	id_oferta: ForeignKey<OfertaServicio, 'id'>;
	estado: Defaults<PartenariadoEstado>;
}

export namespace Partenariado {
	export const Name = 'partenariado';

	export interface Value extends GetType<Partenariado> {}
	export interface CreateData extends GetCreateType<Partenariado> {}
}

export enum PartenariadoEstado {
	EnNegociacion = 'EN_NEGOCIACION',
	Acordado = 'ACORDADO',
	Suspendido = 'SUSPENDIDO',
	EnCreacion = 'EN_CREACION'
}
