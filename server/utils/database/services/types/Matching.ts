import type { DemandaServicio } from './DemandaServicio';
import type { OfertaServicio } from './OfertaServicio';
import { makeKeyFunction, type Float, type ForeignKey, type GetCreateType, type GetType, type PrimaryKey } from './base/Shared';

export interface Matching {
	/** Foreign key of {@linkcode OfertaServicio.id} */
	id_oferta: PrimaryKey<ForeignKey<OfertaServicio, 'id'>>;
	/** Foreign key of {@linkcode DemandaServicio.id} */
	id_demanda: PrimaryKey<ForeignKey<DemandaServicio, 'id'>>;
	procesado: boolean;
	emparejamiento: Float;
}

export namespace Matching {
	export const Name = 'matching';
	export const Key = makeKeyFunction(Name);

	export interface Value extends GetType<Matching> {}
	export interface CreateData extends GetCreateType<Matching> {}
}
