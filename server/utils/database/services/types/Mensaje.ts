import type { Usuario } from './Usuario';
import {
	makeKeyFunction,
	type AutoIncrement,
	type Defaults,
	type ForeignKey,
	type GetCreateType,
	type GetType,
	type Int,
	type PrimaryKey,
	type VarChar
} from './base/Shared';

export interface Mensaje {
	id: PrimaryKey<AutoIncrement<Int>>;
	texto: VarChar<200>;
	fecha: Defaults<Date>;
	/** Foreign key of {@linkcode Usuario.id} */
	usuario: ForeignKey<Usuario, 'id'>;
}

export namespace Mensaje {
	export const Name = 'mensaje';
	export const Key = makeKeyFunction(Name);

	export interface Value extends GetType<Mensaje> {}
	export interface CreateData extends GetCreateType<Mensaje> {}
}
