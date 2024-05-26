import { isNullishOrEmpty } from '@sapphire/utilities';
import type { Knex } from 'knex';
import { AnuncioServicio } from '../../types/AnuncioServicio';
import { AreaServicio_AnuncioServicio } from '../../types/AreaServicio_AnuncioServicio';
import { DemandaServicio } from '../../types/DemandaServicio';
import { TitulacionLocal_Demanda } from '../../types/TitulacionLocal_Demanda';
import { formatDemanda, type FormattedDemanda } from './_shared';

export type AnuncioServicioCreateData = AnuncioServicio.CreateData & { areasServicio?: readonly number[] };
async function crearAnuncio(data: AnuncioServicioCreateData, trx: Knex.Transaction): Promise<AnuncioServicio.Value> {
	const [entry] = await trx(AnuncioServicio.Name)
		.insert({
			titulo: data.titulo,
			descripcion: data.descripcion,
			imagen: data.imagen,
			dummy: data.dummy
		})
		.returning('*');

	if (!isNullishOrEmpty(data.areasServicio)) {
		await trx(AreaServicio_AnuncioServicio.Name) //
			.insert(data.areasServicio.map((area) => ({ id_area: area, id_anuncio: entry.id })));
	}

	return entry;
}

export type DemandaServicioCreateData = AnuncioServicioCreateData &
	Omit<DemandaServicio.CreateData, 'id'> & { titulacionesLocales?: readonly number[] };
export function crearDemanda(data: DemandaServicioCreateData): Promise<FormattedDemanda> {
	return qb.transaction(async (trx) => {
		// Crear el anuncio de servicio asociado a la demanda
		const anuncio = await crearAnuncio(data, trx);

		// Insertar la demanda de servicio asociada al anuncio
		const [demanda] = await trx(DemandaServicio.Name)
			.insert({
				id: anuncio.id,
				creador: data.creador,
				ciudad: data.ciudad,
				finalidad: data.finalidad,
				periodo_definicion_ini: data.periodo_definicion_ini,
				periodo_definicion_fin: data.periodo_definicion_fin,
				periodo_ejecucion_ini: data.periodo_ejecucion_ini,
				periodo_ejecucion_fin: data.periodo_ejecucion_fin,
				fecha_fin: data.fecha_fin,
				observaciones_temporales: data.observaciones_temporales,
				necesidad_social: data.necesidad_social,
				comunidad_beneficiaria: data.comunidad_beneficiaria
			})
			.returning('*');

		if (!isNullishOrEmpty(data.titulacionesLocales)) {
			await trx(TitulacionLocal_Demanda.Name).insert(
				data.titulacionesLocales.map((titulacion) => ({
					id_titulacion: titulacion,
					id_demanda: anuncio.id
				}))
			);
		}

		return formatDemanda({ ...anuncio, ...demanda });
	});
}
