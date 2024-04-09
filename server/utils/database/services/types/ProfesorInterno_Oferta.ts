import type { OfertaServicio } from './OfertaServicio';
import type { ProfesorInterno } from './ProfesorInterno';
import type { ForeignKey, GetCreateType, GetType, PrimaryKey } from './base/Shared';

export interface ProfesorInterno_Oferta {
	/** Foreign key of {@linkcode ProfesorInterno.id} */
	id_profesor: PrimaryKey<ForeignKey<ProfesorInterno, 'id'>>;
	/** Foreign key of {@linkcode OfertaServicio.id} */
	id_oferta: PrimaryKey<ForeignKey<OfertaServicio, 'id'>>;
}

export namespace ProfesorInterno_Oferta {
	export const name = 'profesorinterno_oferta';

	export interface Value extends GetType<ProfesorInterno_Oferta> {}
	export interface CreateData extends GetCreateType<ProfesorInterno_Oferta> {}
}
