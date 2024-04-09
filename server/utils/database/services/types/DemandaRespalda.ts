import type { Notificacion } from './Notificacion';
import type { Partenariado } from './Partenariado';
import type { ForeignKey, GetCreateType, GetType, PrimaryKey } from './base/Shared';

export interface DemandaRespalda {
	/** Foreign key of {@linkcode Notificacion.id} */
	idNotificacion: PrimaryKey<ForeignKey<Notificacion, 'id'>>;
	/** Foreign key of {@linkcode Partenariado.id} */
	idPartenariado: PrimaryKey<ForeignKey<Partenariado, 'id'>>;
}

export namespace DemandaRespalda {
	export const name = 'demandarespalda';

	export interface Value extends GetType<DemandaRespalda> {}
	export interface CreateData extends GetCreateType<DemandaRespalda> {}
}
