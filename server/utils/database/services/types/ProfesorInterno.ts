import type { DatosPersonalesInterno } from './DatosPersonalesInterno';
import type { Profesor } from './Profesor';
import type { Universidad } from './Universidad';
import type { ForeignKey, GetCreateType, GetType, PrimaryKey, VarChar } from './base/Shared';

export interface ProfesorInterno {
	/** Foreign key of {@linkcode Profesor.id} */
	id: PrimaryKey<ForeignKey<Profesor, 'id'>>;
	/** Foreign key of {@linkcode Universidad.id} */
	universidad: ForeignKey<Universidad, 'id'>;
	facultad: VarChar<200>;
	/** Foreign key of {@linkcode DatosPersonalesInterno.id} */
	datos_personales_Id: ForeignKey<DatosPersonalesInterno, 'id'>;
}

export namespace ProfesorInterno {
	export const name = 'profesor_interno';

	export interface Value extends GetType<ProfesorInterno> {}
	export interface CreateData extends GetCreateType<ProfesorInterno> {}
}
