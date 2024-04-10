import type { DatosPersonalesExterno } from './DatosPersonalesExterno';
import type { Usuario } from './Usuario';
import { makeKeyFunction, type ForeignKey, type GetCreateType, type GetType, type PrimaryKey, type VarChar } from './base/Shared';

export interface SocioComunitario {
	/** Foreign key of {@linkcode Usuario.id} */
	id: PrimaryKey<ForeignKey<Usuario, 'id'>>;
	sector: VarChar<200>;
	nombre_socioComunitario: VarChar<200>;
	/** Foreign key of {@linkcode DatosPersonalesExterno.id} */
	datos_personales_Id: ForeignKey<DatosPersonalesExterno, 'id'>;
	url: VarChar<200>;
	mision: VarChar<500>;
}

export namespace SocioComunitario {
	export const Name = 'socio_comunitario';
	export const Key = makeKeyFunction(Name);

	export interface Value extends GetType<SocioComunitario> {}
	export interface CreateData extends GetCreateType<SocioComunitario> {}
}
