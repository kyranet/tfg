import {
	makeKeyFunction,
	type AutoIncrement,
	type GetCreateType,
	type GetType,
	type Int,
	type PrimaryKey,
	type Unique,
	type VarChar
} from './base/Shared';

export interface DatosPersonalesInterno {
	id: PrimaryKey<AutoIncrement<Int>>;
	correo: Unique<VarChar<200>>;
	password: VarChar<200>;
	apellidos: VarChar<200>;
	nombre: VarChar<200>;
	telefono: Int;
}

export namespace DatosPersonalesInterno {
	export const Name = 'datos_personales_interno';
	export const Key = makeKeyFunction(Name);

	export interface Value extends GetType<DatosPersonalesInterno> {}
	export interface CreateData extends GetCreateType<DatosPersonalesInterno> {}
}
