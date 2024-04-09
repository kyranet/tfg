import { defineEventHandler } from 'h3';
import { z } from 'zod';
import Usuario from '../../database/models/usuario.model'; //Revisar Models

const filterSchema = z.object({ terminoBusqueda: z.string() });
const schema = z.object({
	skip: z.coerce.number().default(0),
	limit: z.coerce.number().default(25),
	filtros: z.preprocess((arg) => JSON.parse(arg as string), filterSchema).default({ terminoBusqueda: '' })
});

export default defineEventHandler(async (event) => {
	const { skip, limit, filtros } = await getValidatedQuery(event, schema.parse);
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
