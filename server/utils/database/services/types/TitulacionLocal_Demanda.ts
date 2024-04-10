import type { DemandaServicio } from './DemandaServicio';
import type { TitulacionLocal } from './TitulacionLocal';
import { makeKeyFunction, type ForeignKey, type GetCreateType, type GetType, type PrimaryKey } from './base/Shared';

export interface TitulacionLocal_Demanda {
	/** Foreign key of {@linkcode TitulacionLocal.id} */
	id_titulacion: PrimaryKey<ForeignKey<TitulacionLocal, 'id'>>;
	/** Foreign key of {@linkcode DemandaServicio.id} */
	id_demanda: PrimaryKey<ForeignKey<DemandaServicio, 'id'>>;
}

export namespace TitulacionLocal_Demanda {
	export const Name = 'titulacionlocal_demanda';
	export const Key = makeKeyFunction(Name);

	export interface Value extends GetType<TitulacionLocal_Demanda> {}
	export interface CreateData extends GetCreateType<TitulacionLocal_Demanda> {}
}
