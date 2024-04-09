import type { AutoIncrement, GetCreateType, GetType, Int, PrimaryKey, VarChar } from './base/Shared';

export interface MatchingAreaServicioTitulacion {
	id: PrimaryKey<AutoIncrement<Int>>;
	area_servicio: VarChar<200>;
	titulacion: VarChar<200>;
}

export namespace MatchingAreaServicioTitulacion {
	export const name = 'matching_areaservicio_titulacion';

	export interface Value extends GetType<MatchingAreaServicioTitulacion> {}
	export interface CreateData extends GetCreateType<MatchingAreaServicioTitulacion> {}
}
