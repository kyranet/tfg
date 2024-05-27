import type { DatosPersonalesExterno } from './DatosPersonalesExterno';
import type { Profesor } from './Profesor';
import type { Universidad } from './Universidad';
import { makeKeyFunction, type ForeignKey, type GetCreateType, type GetType, type PrimaryKey, type VarChar } from './base/Shared';

export interface ProfesorExterno {
	/** Foreign key of {@linkcode Profesor.id} */
	id: PrimaryKey<ForeignKey<Profesor, 'id'>>;
	/** Foreign key of {@linkcode Universidad.id} */
	universidad: ForeignKey<Universidad, 'id'>;
	facultad: VarChar<200>;
	/** Foreign key of {@linkcode DatosPersonalesExterno.id} */
	datos_personales_Id: ForeignKey<DatosPersonalesExterno, 'id'>;
}

export namespace ProfesorExterno {
	export const Name = 'profesor_externo';
	export const Key = makeKeyFunction(Name);

	export interface Value extends GetType<ProfesorExterno> {}
	export interface CreateData extends GetCreateType<ProfesorExterno> {}
}
