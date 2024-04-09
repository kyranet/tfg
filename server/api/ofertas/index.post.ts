import { z } from 'zod';
import { crearOferta } from '~/server/utils/database/services/daos/daoOferta';
import { createAndLinkedTags } from '~/server/utils/database/services/daos/daoUtils';
import { OfertaServicio } from '~/server/utils/database/services/types/OfertaServicio';
import { CoercedIntegerId } from '~/server/utils/validators/shared';

const schemaBody = z.object({
	titulo: z.string(),
	descripcion: z.string(),
	imagen: z.string(),
	asignatura: z.string().array(),
	cuatrimestre: z.string(),
	academicYear: z.string(),
	fecha_limite: z.coerce.date(),
	observaciones: z.string(),
	areasServicio: CoercedIntegerId.array(),
	current_user: z.object({ uid: z.string() }),
	tags: z.array(z.string())
});
export default eventHandler(async (event) => {
	const body = await readValidatedBody(event, schemaBody.parse);
	const oferta: OfertaServicio = {
		id: null!,
		titulo: body.titulo,
		descripcion: body.descripcion,
		imagen: body.imagen,
		created_at: null,
		updated_at: null,
		asignatura_objetivo: body.asignatura,
		cuatrimestre: body.cuatrimestre,
		anio_academico: body.academicYear,
		fecha_limite: body.fecha_limite,
		observaciones_temporales: body.observaciones,
		creador: body.current_user.uid,
		area_servicio: body.areasServicio,
		dummy: undefined,
		profesores: [],
		tags: []
	};
	oferta.id = await crearOferta(oferta);
	if (body.tags != undefined) {
		for (let tagName of body.tags) {
			await createAndLinkedTags(tagName, oferta.id, 'oferta');
		}
	}
	return oferta;
});
