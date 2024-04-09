import type { AutoIncrement, GetCreateType, GetType, Int, PrimaryKey, Unique, VarChar } from './base/Shared';

export interface DatosPersonalesExterno {
	id: PrimaryKey<AutoIncrement<Int>>;
	correo: Unique<VarChar<200>>;
	password: VarChar<200>;
	apellidos: VarChar<200>;
	nombre: VarChar<200>;
	telefono: Int;
}

export namespace DatosPersonalesExterno {
	export const name = 'datos_personales_externo';

	export interface Value extends GetType<DatosPersonalesExterno> {}
	export interface CreateData extends GetCreateType<DatosPersonalesExterno> {}
}
