import type { DatosPersonalesInterno } from './DatosPersonalesInterno';
import type { Profesor } from './Profesor';
import type { Universidad } from './Universidad';
import { makeKeyFunction, type ForeignKey, type GetCreateType, type GetType, type PrimaryKey, type VarChar } from './base/Shared';

export interface TutorCA {
	/** Foreign key of {@linkcode Profesor.id} */
	id: PrimaryKey<ForeignKey<Profesor, 'id'>>;
	/** Foreign key of {@linkcode Universidad.id} */
	universidad: ForeignKey<Universidad, 'id'>;
	facultad: VarChar<200>;
	/** Foreign key of {@linkcode DatosPersonalesInterno.id} */
	datos_personales_Id: ForeignKey<DatosPersonalesInterno, 'id'>;
}

export namespace TutorCA{
		export const Name = 'tutorCA';
		export const Key = makeKeyFunction(Name);

		export interface Value extends GetType<TutorCA> {}
		export interface CreateData extends GetCreateType<TutorCA> {}
}
