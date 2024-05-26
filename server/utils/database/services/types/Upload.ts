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

export interface Upload {
	id: PrimaryKey<AutoIncrement<Int>>;
	almacenamiento: VarChar<200>;
	campo: VarChar<200> & ('default' | 'avatar' | 'archivos');
	tipo: VarChar<200> & ('usuarios' | 'iniciativas' | 'partenariados' | 'proyectos');
	tipo_id: VarChar<200>;
	path: VarChar<200>;
	client_name: VarChar<200>;
	nombre: VarChar<200>;
	/** Foreign key of {@linkcode Usuario.id} */
	creador: ForeignKey<Usuario, 'id'>;
	createdAt: Defaults<Date>;
	updatedAt: Defaults<Date>;
	_v: Int;
}

export namespace Upload {
	export const Name = 'upload';
	export const Key = makeKeyFunction(Name);

	export interface Value extends GetType<Upload> {}
	export interface CreateData extends GetCreateType<Upload> {}

	export interface ValueUserAvatar extends Value {
		tipo: 'usuarios';
		campo: 'avatar';
	}

	export interface ValueInitiativeDefault extends Value {
		tipo: 'iniciativas';
		campo: 'default';
	}

	export interface ValueInitiativeFiles extends Value {
		tipo: 'iniciativas';
		campo: 'archivos';
	}

	export interface ValuePartnershipFiles extends Value {
		tipo: 'partenariados';
		campo: 'archivos';
	}

	export interface ValueProjectFiles extends Value {
		tipo: 'proyectos';
		campo: 'archivos';
	}
}
