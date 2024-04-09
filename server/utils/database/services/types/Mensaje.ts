import type { Usuario } from './Usuario';
import type { AutoIncrement, Defaults, ForeignKey, GetCreateType, GetType, Int, PrimaryKey, VarChar } from './base/Shared';

export interface Mensaje {
	id: PrimaryKey<AutoIncrement<Int>>;
	texto: VarChar<200>;
	fecha: Defaults<Date>;
	/** Foreign key of {@linkcode Usuario.id} */
	usuario: ForeignKey<Usuario, 'id'>;
}

export namespace Mensaje {
	export const name = 'mensaje';

	export interface Value extends GetType<Mensaje> {}
	export interface CreateData extends GetCreateType<Mensaje> {}
}
