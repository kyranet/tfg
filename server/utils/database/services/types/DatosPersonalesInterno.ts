import type { AutoIncrement, GetCreateType, GetType, Int, PrimaryKey, Unique, VarChar } from './base/Shared';

export interface DatosPersonalesInterno {
	id: PrimaryKey<AutoIncrement<Int>>;
	correo: Unique<VarChar<200>>;
	password: VarChar<200>;
	apellidos: VarChar<200>;
	nombre: VarChar<200>;
	telefono: Int;
}

export namespace DatosPersonalesInterno {
	export const name = 'datos_personales_interno';

	export interface Value extends GetType<DatosPersonalesInterno> {}
	export interface CreateData extends GetCreateType<DatosPersonalesInterno> {}
}
