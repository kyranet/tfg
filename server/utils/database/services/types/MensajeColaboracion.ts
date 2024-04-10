import type { Colaboracion } from './Colaboracion';
import type { Mensaje } from './Mensaje';
import { makeKeyFunction, type ForeignKey, type GetCreateType, type GetType, type PrimaryKey } from './base/Shared';

export interface MensajeColaboracion {
	/** Foreign key of {@linkcode Mensaje.id} */
	id_mensaje: PrimaryKey<ForeignKey<Mensaje, 'id'>>;
	/** Foreign key of {@linkcode Colaboracion.id} */
	id_colaboracion: PrimaryKey<ForeignKey<Colaboracion, 'id'>>;
}

export namespace MensajeColaboracion {
	export const Name = 'mensaje_colaboracion';
	export const Key = makeKeyFunction(Name);

	export interface Value extends GetType<MensajeColaboracion> {}
	export interface CreateData extends GetCreateType<MensajeColaboracion> {}
}
