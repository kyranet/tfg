import type { DatosPersonalesInterno } from './DatosPersonalesInterno';
import { makeKeyFunction, type ForeignKey, type GetCreateType, type GetType, type Int, type PrimaryKey } from './base/Shared';

export interface Admin {
	id: PrimaryKey<Int>;
	/** Foreign key of {@linkcode DatosPersonalesInterno.id} */
	datos_personales_Id: ForeignKey<DatosPersonalesInterno, 'id'>;
}

export namespace Admin {
	export const Name = 'admin';
	export const Key = makeKeyFunction(Name);

	export interface Value extends GetType<Admin> {}
	export interface CreateData extends GetCreateType<Admin> {}
}
