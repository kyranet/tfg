import type { DemandaServicio } from './DemandaServicio';
import type { TitulacionLocal } from './TitulacionLocal';
import type { ForeignKey, GetCreateType, GetType, PrimaryKey } from './base/Shared';

export interface TitulacionLocal_Demanda {
	/** Foreign key of {@linkcode TitulacionLocal.id} */
	id_titulacion: PrimaryKey<ForeignKey<TitulacionLocal, 'id'>>;
	/** Foreign key of {@linkcode DemandaServicio.id} */
	id_demanda: PrimaryKey<ForeignKey<DemandaServicio, 'id'>>;
}

export namespace TitulacionLocal_Demanda {
	export const name = 'titulacionlocal_demanda';

	export interface Value extends GetType<TitulacionLocal_Demanda> {}
	export interface CreateData extends GetCreateType<TitulacionLocal_Demanda> {}
}
