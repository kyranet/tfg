import type { Usuario } from './Usuario';
import { makeKeyFunction, type ForeignKey, type GetCreateType, type GetType, type PrimaryKey } from './base/Shared';

export interface Profesor {
	id: PrimaryKey<ForeignKey<Usuario, 'id'>>;
}

export namespace Profesor {
	export const Name = 'profesor';
	export const Key = makeKeyFunction(Name);

	export interface Value extends GetType<Profesor> {}
	export interface CreateData extends GetCreateType<Profesor> {}
}
