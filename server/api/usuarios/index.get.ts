import { z } from 'zod';
import { SearchQuery, stringJSON } from '~/server/utils/validators/shared';
import Usuario from '../../database/models/usuario.model'; //Revisar Models

const filterSchema = z.object({ terminoBusqueda: z.string() });
const schemaQuery = z //
	.object({ filtros: stringJSON(filterSchema).default({ terminoBusqueda: '' }) })
	.merge(SearchQuery);

export default eventHandler(async (event) => {
	const { skip, limit, filtros } = await getValidatedQuery(event, schemaQuery.parse);
	let conditions = [];

	// Logica de filtros
	// filtro por texto (titulo)
	const search = filtros.terminoBusqueda.trim();
	if (search !== '') {
		let regex = new RegExp(search, 'i');
		conditions.push({
			$or: [
				{ nombre: regex },
				{ apellidos: regex },
				{ email: regex },
				{ universidad: regex },
				{ titulo: regex },
				{ sector: regex },
				{ rol: regex },
				{ origin_login: regex }
			]
		});
	}
	const [usuarios, filtradas, total] = await Promise.all([
		Usuario.find(conditions.length ? { $and: conditions } : {})
			.sort('-createdAt')
			.skip(skip)
			.limit(limit),
		Usuario.find(conditions.length ? { $and: conditions } : {}).countDocuments(),
		Usuario.countDocuments()
	]);

	return { usuarios, filtradas, total };
});
