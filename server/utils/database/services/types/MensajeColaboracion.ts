import type { Colaboracion } from './Colaboracion';
import type { Mensaje } from './Mensaje';
import type { ForeignKey, GetCreateType, GetType, PrimaryKey } from './base/Shared';

export interface MensajeColaboracion {
	/** Foreign key of {@linkcode Mensaje.id} */
	id_mensaje: PrimaryKey<ForeignKey<Mensaje, 'id'>>;
	/** Foreign key of {@linkcode Colaboracion.id} */
	id_colaboracion: PrimaryKey<ForeignKey<Colaboracion, 'id'>>;
}

export namespace NecesidadSocial {
	export const name = 'mensaje_colaboracion';

	export interface Value extends GetType<MensajeColaboracion> {}
	export interface CreateData extends GetCreateType<MensajeColaboracion> {}
}
