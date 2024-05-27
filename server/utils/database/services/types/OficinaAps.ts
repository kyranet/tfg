import type { DatosPersonalesInterno } from './DatosPersonalesInterno';
import type { Usuario } from './Usuario';
import { makeKeyFunction, type ForeignKey, type GetCreateType, type GetType, type PrimaryKey } from './base/Shared';

export interface OficinaAps {
	/** Foreign key of {@linkcode Usuario.id} */
	id: PrimaryKey<ForeignKey<Usuario, 'id'>>;
	/** Foreign key of {@linkcode DatosPersonalesInterno.id} */
	datos_personales_Id: ForeignKey<DatosPersonalesInterno, 'id'>;
}

export namespace OficinaAps {
	export const Name = 'oficinaaps';
	export const Key = makeKeyFunction(Name);

	export interface Value extends GetType<OficinaAps> {}
	export interface CreateData extends GetCreateType<OficinaAps> {}
}
