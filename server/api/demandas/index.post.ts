import { crearDemanda } from '~/server/utils/database/services/daos/daoDemanda';
import { DemandaServicio } from '~/server/utils/database/services/types/DemandaServicio';
import { DemandaBody } from '~/server/utils/validators/Demandas';

const schemaBody = DemandaBody;
export const crearDemandas = eventHandler(async (event) => {
	const body = await readValidatedBody(event, schemaBody.parse);

	// Crear la instancia de la demanda siguiendo la original
	const demanda: DemandaServicio = {
		id: null!, // id
		titulo: body.titulo,
		descripcion: body.descripcion,
		imagen: body.imagen,
		created_at: null,
		updated_at: null,
		// NOTE: No hagamos body.current_user, sino que usemos el usuario actual
		// que viene en el evento
		creador: body.current_user.uid, // Esta en el original, correcto?
		ciudad: body.ciudad,
		finalidad: body.finalidad,
		periodo_definicion_ini: body.fechas.definition.start,
		periodo_definicion_fin: body.fechas.definition.end,
		periodo_ejecucion_ini: body.fechas.execution.start,
		periodo_ejecucion_fin: body.fechas.execution.end,
		fecha_fin: body.fechas.end,
		observaciones_temporales: body.observaciones,
		necesidad_social: body.necesidad_social,
		titulacionlocal: body.titulacionLocal,
		area_servicio: body.areaServicio,
		comunidad_beneficiaria: body.comunidadBeneficiaria,
		dummy: 0
	};

	// Llamada al DAO para guardar la nueva demanda
	const id = await crearDemanda(demanda);
	return { ...demanda, id };
});
