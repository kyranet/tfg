import type { OfertaServicio } from './OfertaServicio';
import type { ProfesorInterno } from './ProfesorInterno';
import { makeKeyFunction, type ForeignKey, type GetCreateType, type GetType, type PrimaryKey } from './base/Shared';

export interface ProfesorInterno_Oferta {
	/** Foreign key of {@linkcode ProfesorInterno.id} */
	id_profesor: PrimaryKey<ForeignKey<ProfesorInterno, 'id'>>;
	/** Foreign key of {@linkcode OfertaServicio.id} */
	id_oferta: PrimaryKey<ForeignKey<OfertaServicio, 'id'>>;
}

export namespace ProfesorInterno_Oferta {
	export const Name = 'profesorinterno_oferta';
	export const Key = makeKeyFunction(Name);

	export interface Value extends GetType<ProfesorInterno_Oferta> {}
	export interface CreateData extends GetCreateType<ProfesorInterno_Oferta> {}
}
