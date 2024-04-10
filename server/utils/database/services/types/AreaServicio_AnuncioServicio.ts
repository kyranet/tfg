import type { AnuncioServicio } from './AnuncioServicio';
import type { AreaServicio } from './AreaServicio';
import { makeKeyFunction, type ForeignKey, type GetCreateType, type GetType, type PrimaryKey } from './base/Shared';

export interface AreaServicio_AnuncioServicio {
	/** Foreign key of @linkcode {@linkcode AreaServicio.id} */
	id_area: PrimaryKey<ForeignKey<AreaServicio, 'id'>>;
	/** Foreign key of @linkcode {@linkcode AnuncioServicio.id} */
	id_anuncio: PrimaryKey<ForeignKey<AnuncioServicio, 'id'>>;
}

export namespace AreaServicio_AnuncioServicio {
	export const Name = 'areaservicio_anuncioservicio';
	export const Key = makeKeyFunction(Name);

	export interface Value extends GetType<AreaServicio_AnuncioServicio> {}
	export interface CreateData extends GetCreateType<AreaServicio_AnuncioServicio> {}
}
