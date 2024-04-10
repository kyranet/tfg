import type { Estudiante } from './Estudiante';
import type { Proyecto } from './Proyecto';
import { makeKeyFunction, type ForeignKey, type GetCreateType, type GetType, type PrimaryKey } from './base/Shared';

export interface EstudianteProyecto {
	/** Foreign key of {@linkcode Estudiante.id} */
	id_estudiante: PrimaryKey<ForeignKey<Estudiante, 'id'>>;
	/** Foreign key of {@linkcode Proyecto.id} */
	id_proyecto: PrimaryKey<ForeignKey<Proyecto, 'id'>>;
}

export namespace EstudianteProyecto {
	export const Name = 'estudiante_proyecto';
	export const Key = makeKeyFunction(Name);

	export interface Value extends GetType<EstudianteProyecto> {}
	export interface CreateData extends GetCreateType<EstudianteProyecto> {}
}
