import type { DemandaServicio } from './DemandaServicio';
import type { OfertaServicio } from './OfertaServicio';
import {
	makeKeyFunction,
	type AutoIncrement,
	type Defaults,
	type ForeignKey,
	type GetCreateType,
	type GetType,
	type Int,
	type PrimaryKey
} from './base/Shared';

export interface PrevioPartenariado {
	id: PrimaryKey<AutoIncrement<Int>>;
	/** Foreign key of {@linkcode DemandaServicio.id} */
	id_demanda: ForeignKey<DemandaServicio, 'id'>;
	/** Foreign key of {@linkcode OfertaServicio.id} */
	id_oferta: ForeignKey<OfertaServicio, 'id'>;
	completado_profesor: Defaults<boolean>;
	completado_socioComunitario: Defaults<boolean>;
}

export namespace PrevioPartenariado {
	export const Name = 'previo_partenariado';
	export const Key = makeKeyFunction(Name);

	export interface Value extends GetType<PrevioPartenariado> {}
	export interface CreateData extends GetCreateType<PrevioPartenariado> {}
}
