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

export interface Notificacion {
	id: PrimaryKey<AutoIncrement<Int>>;
	idDestino: ForeignKey<Usuario, 'id'>;
	leido: Defaults<boolean>;
	titulo: VarChar<200>;
	mensaje: VarChar<1200>;
	fecha_fin: Defaults<Date>;
	pendiente: Defaults<boolean>;
}

export namespace Notificacion {
	export const Name = 'notificaciones';
	export const Key = makeKeyFunction(Name);

	export interface Value extends GetType<Notificacion> {}
	export interface CreateData extends GetCreateType<Notificacion> {}
}
