import { crearDemanda } from '~/server/utils/database/services/daos/daoDemanda';
import { DemandaBody } from '~/server/utils/validators/Demandas';

const schemaBody = DemandaBody;
export const crearDemandas = eventHandler(async (event) => {
	const body = await readValidatedBody(event, schemaBody.parse);
	const user = await requireAuthSession(event);

	return crearDemanda({
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
		comunidad_beneficiaria: body.comunidadBeneficiaria
	});
});
