import type { ProfesorInterno } from './ProfesorInterno';
import type { TitulacionLocal } from './TitulacionLocal';
import { makeKeyFunction, type ForeignKey, type GetCreateType, type GetType, type PrimaryKey } from './base/Shared';

export interface TitulacionLocal_Profesor {
	/** Foreign key of {@linkcode TitulacionLocal.id} */
	id_titulacion: PrimaryKey<ForeignKey<TitulacionLocal, 'id'>>;
	/** Foreign key of {@linkcode ProfesorInterno.id} */
	id_profesor: PrimaryKey<ForeignKey<ProfesorInterno, 'id'>>;
}

export namespace TitulacionLocal_Profesor {
	export const Name = 'titulacionlocal_profesor';
	export const Key = makeKeyFunction(Name);

	export interface Value extends GetType<TitulacionLocal_Profesor> {}
	export interface CreateData extends GetCreateType<TitulacionLocal_Profesor> {}
}
