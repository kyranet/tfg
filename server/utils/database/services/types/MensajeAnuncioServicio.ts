import type { AnuncioServicio } from './AnuncioServicio';
import type { Mensaje } from './Mensaje';
import type { ForeignKey, GetCreateType, GetType, PrimaryKey } from './base/Shared';

export interface MensajeAnuncioServicio {
	/** Foreign key of {@linkcode Mensaje.id} */
	id_mensaje: PrimaryKey<ForeignKey<Mensaje, 'id'>>;
	/** Foreign key of {@linkcode AnuncioServicio.id} */
	id_anuncio: PrimaryKey<ForeignKey<AnuncioServicio, 'id'>>;
}

export namespace MensajeAnuncioServicio {
	export const Name = 'mensaje_anuncioservicio';

	export interface Value extends GetType<MensajeAnuncioServicio> {}
	export interface CreateData extends GetCreateType<MensajeAnuncioServicio> {}
}
