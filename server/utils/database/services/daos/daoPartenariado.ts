import { isNullishOrEmpty } from '@sapphire/utilities';
import { Partenariado } from '../types/Partenariado';

export async function obtenerPartenariados(limit: number, offset: number, creador: string | undefined): Promise<Partenariado[]> {
	let query = qb('partenariado as p')
		.join('oferta_servicio as of', 'p.id_oferta', '=', 'of.id')
		.join('demanda_servicio as ds', 'p.id_demanda', '=', 'ds.id')
		.join('colaboracion as c', 'p.id', '=', 'c.id')
		.select('p.id as partenariado_id', 'p.*', 'of.*', 'ds.*', 'c.*');

	if (!isNullishOrEmpty(creador)) {
		query = query.where('of.creador', creador).orWhere('ds.creador', creador);
	}

	try {
		const resultados = await query.limit(limit).offset(offset);
		return resultados.map((x) => ({
			id: x.partenariado_id,
			titulo: x.titulo,
			descripcion: x.descripcion,
			admite_externos: false,
			creador: x.creador,
			id_demanda: x.id_demanda,
			id_oferta: x.id_oferta,
			estado: x.estado
		}));
	} catch (err) {
		console.error('Error al obtener partenariados', err);
		throw err;
	}
}
