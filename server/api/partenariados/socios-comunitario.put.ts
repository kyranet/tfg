import { z } from 'zod';
import {
	actualizarPartenariado,
	actualizarPrevioPartenariado,
	crearPartenariado,
	crearPrevioPartenariado,
	maybeObtenerIdPartenariado
} from '~/server/utils/database/services/daos/daoColaboracion';
import { crearDemanda } from '~/server/utils/database/services/daos/daoDemanda';
import { PartenariadoEstado } from '~/server/utils/database/services/types/Partenariado';
import { DemandaBody } from '~/server/utils/validators/Demandas';
import { PartenariadoBody } from '~/server/utils/validators/Partenariados';
import { CoercedIntegerId } from '~/server/utils/validators/shared';

const schemaShared = PartenariadoBody.omit({ demanda: true });
const schemaWithDemandaId = z.object({ demanda: CoercedIntegerId }).merge(schemaShared);
const schemaWithoutDemandaId = DemandaBody.merge(schemaShared);
const schemaBody = z.union([schemaWithDemandaId, schemaWithoutDemandaId]);
export default eventHandler(async (event) => {
	const body = await readValidatedBody(event, schemaBody.parse);
	const user = await requireAuthSession(event); // Asegúrate de tener una forma de acceder al usuario actual

	let estado: PartenariadoEstado;
	let demandaId: number;
	const definedDemanda = 'demanda' in body;
	if (definedDemanda) {
		estado = PartenariadoEstado.EnNegociacion;
		demandaId = body.demanda;
	} else {
		estado = PartenariadoEstado.EnCreacion;
		const demanda = await crearDemanda({
			id: null!,
			titulo: body.titulo,
			descripcion: body.descripcion,
			imagen: body.imagen,
			creador: user.data.id,
			ciudad: body.ciudad,
			finalidad: body.finalidad,
			periodo_definicion_ini: body.fechas.definition.start,
			periodo_definicion_fin: body.fechas.definition.end,
			periodo_ejecucion_ini: body.fechas.execution.start,
			periodo_ejecucion_fin: body.fechas.execution.end,
			fecha_fin: body.fechas.end,
			observaciones_temporales: body.observaciones,
			necesidad_social: body.necesidadSocial,
			titulacionesLocales: body.titulacionesLocales,
			areaServicio: body.areaServicio,
			comunidad_beneficiaria: '',
			dummy: true
		});
		demandaId = demanda.id;
	}

	let partenariadoId = await maybeObtenerIdPartenariado({ id_demanda: demandaId, id_oferta: body.oferta });
	const partenariado =
		partenariadoId === null
			? await crearPartenariado({
					titulo: body.titulo,
					descripcion: body.descripcion,
					admite_externos: body.admiteExternos,
					responsable: body.responsable,
					profesores: body.profesores,
					id_demanda: demandaId,
					id_oferta: body.oferta,
					estado: estado
				})
			: await actualizarPartenariado({
					id: partenariadoId,
					titulo: body.titulo,
					descripcion: body.descripcion,
					admite_externos: body.admiteExternos,
					responsable: body.responsable,
					profesores: body.profesores,
					id_demanda: demandaId,
					id_oferta: body.oferta,
					estado: estado
				});

	if (definedDemanda) {
		await actualizarPrevioPartenariado({
			id_demanda: demandaId,
			id_oferta: partenariado.ofertaId,
			completado_profesor: true,
			completado_socioComunitario: false
		});
	} else {
		await crearPrevioPartenariado({
			id_demanda: demandaId,
			id_oferta: partenariado.ofertaId,
			completado_profesor: true,
			completado_socioComunitario: false
		});
	}

	return partenariado;
});
