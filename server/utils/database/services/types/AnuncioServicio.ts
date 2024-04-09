import type { AutoIncrement, Defaults, GetCreateType, GetType, Int, PrimaryKey, VarChar } from './base/Shared';

export interface AnuncioServicio {
	id: PrimaryKey<AutoIncrement<Int>>;
	titulo: VarChar<200>;
	descripcion: VarChar<1200>;
	imagen: Defaults<VarChar<200> | null>;
	created_at: Defaults<Date>;
	updated_at: Defaults<Date>;
	dummy: Defaults<boolean>;
}

export namespace AnuncioServicio {
	export const Name = 'anuncio_servicio';

	export interface Value extends GetType<AnuncioServicio> {}
	export interface CreateData extends GetCreateType<AnuncioServicio> {}
}
