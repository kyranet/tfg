import { isNullishOrEmpty } from '@sapphire/utilities';
import type { Knex } from 'knex';
import { AnuncioServicio } from '../../types/AnuncioServicio';
import { AreaServicio_AnuncioServicio } from '../../types/AreaServicio_AnuncioServicio';
import { DemandaServicio } from '../../types/DemandaServicio';
import { TitulacionLocal_Demanda } from '../../types/TitulacionLocal_Demanda';
import { formatDemanda, type FormattedDemanda } from './_shared';

export interface CreateAnnouncementOptions {
	title: string;
	image?: string | null;
	description: string;
	serviceAreas?: readonly number[];
}
async function crearAnuncio(data: CreateAnnouncementOptions, trx: Knex.Transaction): Promise<AnuncioServicio.Value> {
	const [entry] = await trx(AnuncioServicio.Name)
		.insert({
			titulo: data.title,
			descripcion: data.description,
			imagen: data.image
		})
		.returning('*');

	if (!isNullishOrEmpty(data.serviceAreas)) {
		await trx(AreaServicio_AnuncioServicio.Name).insert(
			data.serviceAreas.map((area) => ({
				id_area: area,
				id_anuncio: entry.id
			}))
		);
	}

	return entry;
}

export interface CreateDemandOptions extends CreateAnnouncementOptions {
	city: string;
	purpose: string;
	creator: number;
	periodDefinitionStart: Date | null;
	periodDefinitionEnd: Date | null;
	periodExecutionStart: Date | null;
	periodExecutionEnd: Date | null;
	periodDeadline: Date | null;
	temporaryObservations: string | null;
	beneficiaryCommunity: string;
	socialNeed: number;
	degrees?: readonly number[];
}
export function crearDemanda(data: CreateDemandOptions): Promise<FormattedDemanda> {
	return qb.transaction(async (trx) => {
		// Crear el anuncio de servicio asociado a la demanda
		const anuncio = await crearAnuncio(data, trx);

		// Insertar la demanda de servicio asociada al anuncio
		const [demanda] = await trx(DemandaServicio.Name)
			.insert({
				id: anuncio.id,
				creador: data.creator,
				ciudad: data.city,
				finalidad: data.purpose,
				periodo_definicion_ini: data.periodDefinitionStart,
				periodo_definicion_fin: data.periodDefinitionEnd,
				periodo_ejecucion_ini: data.periodExecutionStart,
				periodo_ejecucion_fin: data.periodExecutionEnd,
				fecha_fin: data.periodDeadline,
				observaciones_temporales: data.temporaryObservations,
				necesidad_social: data.socialNeed,
				comunidad_beneficiaria: data.beneficiaryCommunity
			})
			.returning('*');

		if (!isNullishOrEmpty(data.degrees)) {
			await trx(TitulacionLocal_Demanda.Name).insert(
				data.degrees.map((titulacion) => ({
					id_titulacion: titulacion,
					id_demanda: anuncio.id
				}))
			);
		}

		return formatDemanda({ ...anuncio, ...demanda });
	});
}
