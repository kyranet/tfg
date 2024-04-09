import type { AnuncioServicio } from './AnuncioServicio';
import type { NecesidadSocial } from './NecesidadSocial';
import type { SocioComunitario } from './SocioComunitario';
import type { Defaults, ForeignKey, GetCreateType, GetType, PrimaryKey, VarChar } from './base/Shared';

export interface DemandaServicio {
	/** Foreign key of {@linkcode AnuncioServicio.id} */
	id: PrimaryKey<ForeignKey<AnuncioServicio, 'id'>>;
	/** Foreign key of {@linkcode SocioComunitario.id} */
	creador: ForeignKey<SocioComunitario, 'id'>;
	ciudad: VarChar<200>;
	finalidad: VarChar<200>;
	periodo_definicion_ini: Defaults<Date | null>;
	periodo_definicion_fin: Defaults<Date | null>;
	periodo_ejecucion_ini: Defaults<Date | null>;
	periodo_ejecucion_fin: Defaults<Date | null>;
	fecha_fin: Defaults<Date | null>;
	observaciones_temporales: Defaults<VarChar<1200> | null>;
	/** Foreign key of {@linkcode NecesidadSocial.id} */
	necesidad_social: ForeignKey<NecesidadSocial, 'id'>;
	comunidad_beneficiaria: VarChar<200>;
}

export namespace DemandaServicio {
	export const Name = 'demanda_servicio';

	export interface Value extends GetType<DemandaServicio> {}
	export interface CreateData extends GetCreateType<DemandaServicio> {}
}
