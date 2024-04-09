import { defineEventHandler, readBody, createError } from 'h3';
import { crearOferta } from '../../utils/database/services/daos/daoOferta';
import TOferta from '../../utils/database/services/Transfer/tOfertaServicio';
import { createAndLinkedTags } from '../../utils/database/services/daos/daoUtils';

export default defineEventHandler(async (event) => {
	try {
		const body = await readBody(event);
		let areas = body.area_servicio.map((data) => data.id);
		let oferta: TOferta = {
			id: null,
			titulo: body.titulo,
			descripcion: body.descripcion,
			imagen: body.imagen,
			created_at: null,
			updated_at: null,
			asignatura_objetivo: body.asignatura,
			cuatrimestre: body.cuatrimestre,
			anio_academico: body.anio_academico,
			fecha_limite: body.fecha_limite,
			observaciones_temporales: body.observaciones,
			creador: body.current_user.uid,
			area_servicio: areas,
			dummy: undefined,
			profesores: [],
			tags: []
		};

		let ofertaId = await crearOferta(oferta);
		oferta.id = ofertaId;
		if (body.tags != undefined) {
			for (let tagName of body.tags) {
				await createAndLinkedTags(tagName, ofertaId, 'oferta');
			}
		}
		return { ok: true, oferta };
	} catch (error) {
		console.error(error);
		throw createError({ statusCode: 500, statusMessage: 'Error inesperado' });
	}
});
