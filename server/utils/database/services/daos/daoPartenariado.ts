const knex = require('../../config');
import Partenariado from '../Transfer/tPartenariado';

export async function obtenerPartenariados(limit: number, offset: number, filters: string): Promise<Partenariado[]> {
	const fil = JSON.parse(filters);

	// Usamos knex para la query
	let query = knex('partenariado as p')
		.join('oferta_servicio as of', 'p.id_oferta', '=', 'of.id')
		.join('demanda_servicio as ds', 'p.id_demanda', '=', 'ds.id')
		.join('colaboracion as c', 'p.id', '=', 'c.id')
		.select('p.id as partenariado_id', 'p.*', 'of.*', 'ds.*', 'c.*');

	if (fil.creador) {
		query = query.where('of.creador', fil.creador).orWhere('ds.creador', fil.creador);
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
