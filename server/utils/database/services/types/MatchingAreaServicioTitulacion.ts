import { makeKeyFunction, type AutoIncrement, type GetCreateType, type GetType, type Int, type PrimaryKey, type VarChar } from './base/Shared';

export interface MatchingAreaServicioTitulacion {
	id: PrimaryKey<AutoIncrement<Int>>;
	area_servicio: VarChar<200>;
	titulacion: VarChar<200>;
}

export namespace MatchingAreaServicioTitulacion {
	export const Name = 'matching_areaservicio_titulacion';
	export const Key = makeKeyFunction(Name);

	export interface Value extends GetType<MatchingAreaServicioTitulacion> {}
	export interface CreateData extends GetCreateType<MatchingAreaServicioTitulacion> {}
}
