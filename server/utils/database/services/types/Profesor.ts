import type { Usuario } from './Usuario';
import type { ForeignKey, GetCreateType, GetType, PrimaryKey } from './base/Shared';

export interface Profesor {
	id: PrimaryKey<ForeignKey<Usuario, 'id'>>;
}

export namespace Profesor {
	export const Name = 'profesor';

	export interface Value extends GetType<Profesor> {}
	export interface CreateData extends GetCreateType<Profesor> {}
}
