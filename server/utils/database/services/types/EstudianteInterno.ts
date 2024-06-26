import type { DatosPersonalesInterno } from './DatosPersonalesInterno';
import type { Estudiante } from './Estudiante';
import type { TitulacionLocal } from './TitulacionLocal';
import { makeKeyFunction, type ForeignKey, type GetCreateType, type GetType, type PrimaryKey } from './base/Shared';

export interface EstudianteInterno {
	/** Foreign key of {@linkcode Estudiante.id} */
	id: PrimaryKey<ForeignKey<Estudiante, 'id'>>;
	/** Foreign key of {@linkcode TitulacionLocal.id} */
	titulacion_local: ForeignKey<TitulacionLocal, 'id'>;
	/** Foreign key of {@linkcode DatosPersonalesInterno.id} */
	datos_personales_Id: ForeignKey<DatosPersonalesInterno, 'id'>;
}

export namespace EstudianteInterno {
	export const Name = 'estudiante_interno';
	export const Key = makeKeyFunction(Name);

	export interface Value extends GetType<EstudianteInterno> {}
	export interface CreateData extends GetCreateType<EstudianteInterno> {}
}
