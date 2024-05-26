import { z } from 'zod';
import { crearOferta } from '~/server/utils/database/services/daos/daoOferta';
import { createAndLinkedTags } from '~/server/utils/database/services/daos/daoUtils';
import { Quarter } from '~/server/utils/database/services/types/OfertaServicio';

const schemaBody = z.object({
	title: z.string().max(200),
	description: z.string().max(1200),
	image: z.string().nullable().default(null),
	subjects: z.string().max(200).array().max(10),
	quarter: z.nativeEnum(Quarter).nullable().default(null),
	academicYear: z.number().int().nullable().default(null),
	deadline: z.coerce.date().nullable().default(null),
	remarks: z.string().max(1200).nullable().default(null),
	serviceAreas: z.number().int().array(),
	tags: z.string().max(32).array().max(10).default([])
});
export default eventHandler(async (event) => {
	const body = await readValidatedBody(event, schemaBody.parse);
	const user = await requireAuthSession(event);
	const oferta = await crearOferta({
		titulo: body.title,
		descripcion: body.description,
		imagen: body.image,
		asignaturas: body.subjects,
		cuatrimestre: body.quarter,
		anio_academico: body.academicYear,
		fecha_limite: body.deadline,
		observaciones_temporales: body.remarks,
		creador: user.data.id,
		areasServicio: body.serviceAreas,
		profesores: []
	});

	for (const name of body.tags) {
		await createAndLinkedTags(name, oferta.id, 'oferta');
	}
	return oferta;
});
