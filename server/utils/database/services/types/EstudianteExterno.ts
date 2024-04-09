import type { DatosPersonalesExterno } from './DatosPersonalesExterno';
import type { Estudiante } from './Estudiante';
import type { Universidad } from './Universidad';
import type { ForeignKey, GetCreateType, GetType, PrimaryKey, VarChar } from './base/Shared';

export interface EstudianteExterno {
	/** Foreign key of {@linkcode Estudiante.id} */
	id: PrimaryKey<ForeignKey<Estudiante, 'id'>>;
	/** Foreign key of {@linkcode Universidad.id} */
	universidad: ForeignKey<Universidad, 'id'>;
	titulacion: VarChar<200>;
	/** Foreign key of {@linkcode DatosPersonalesExterno.id} */
	datos_personales_Id: ForeignKey<DatosPersonalesExterno, 'id'>;
}

export namespace EstudianteExterno {
	export const name = 'estudiante_externo';

	export interface Value extends GetType<EstudianteExterno> {}
	export interface CreateData extends GetCreateType<EstudianteExterno> {}
}
