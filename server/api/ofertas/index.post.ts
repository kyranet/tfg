import { z } from 'zod';
import { crearOferta } from '~/server/utils/database/services/daos/daoOferta';
import { createAndLinkedTags } from '~/server/utils/database/services/daos/daoUtils';

const schemaBody = z.object({
	titulo: z.string(),
	descripcion: z.string(),
	imagen: z.string(),
	asignatura: z.string().array(),
	cuatrimestre: z.number().int(),
	academicYear: z.number().int(),
	fecha_limite: z.coerce.date(),
	observaciones: z.string(),
	areasServicio: z.number().int().array(),
	tags: z.string().array().default([])
});
export default eventHandler(async (event) => {
	const body = await readValidatedBody(event, schemaBody.parse);
	const user = await requireAuthSession(event);
	const oferta = await crearOferta({
		titulo: body.titulo,
		descripcion: body.descripcion,
		imagen: body.imagen,
		asignaturas: body.asignatura,
		cuatrimestre: body.cuatrimestre,
		anio_academico: body.academicYear,
		fecha_limite: body.fecha_limite,
		observaciones_temporales: body.observaciones,
		creador: user.data.id,
		areasServicio: body.areasServicio,
		profesores: []
	});

	for (const name of body.tags) {
		await createAndLinkedTags(name, oferta.id, 'oferta');
	}
	return oferta;
});
