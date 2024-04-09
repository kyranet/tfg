import { z } from 'zod';
import {
	actualizarPartenariado,
	actualizarPrevioPartenariado,
	crearPartenariado,
	obtenerIdPartenariado
} from '~/server/utils/database/services/daos/daoColaboracion';
import { crearDemanda } from '~/server/utils/database/services/daos/daoDemanda';
import type { DemandaServicio } from '~/server/utils/database/services/types/DemandaServicio';
import { PartenariadoEstado, type Partenariado } from '~/server/utils/database/services/types/Partenariado';
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
	if ('demanda' in body) {
		estado = PartenariadoEstado.EnCreacion;
		demandaId = body.demanda;
	} else {
		estado = PartenariadoEstado.EnNegociacion;
		let demanda: DemandaServicio = {
			id: null!,
			titulo: body.titulo,
			descripcion: body.descripcion,
			imagen: body.imagen,
			creador: user.id,
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
			comunidad_beneficiaria: '',
			dummy: 1,
			created_at: undefined,
			updated_at: undefined
		};
		demandaId = await crearDemanda(demanda);
	}

	let partenariadoId = await obtenerIdPartenariado(demandaId, body.oferta);
	let partenariado: Partenariado = {
		id: partenariadoId,
		titulo: body.titulo,
		descripcion: body.descripcion,
		admite_externos: body.admiteExternos,
		responsable: body.responsable,
		profesores: body.profesores,
		id_demanda: demandaId,
		id_oferta: body.oferta,
		estado: estado
	};

	if (partenariadoId === null) {
		await crearPartenariado(partenariado);
	} else {
		await actualizarPartenariado(partenariado);
	}

	// Actualizar estado del partenariado previo, si necesario
	//Revisar si es correcto los parametros que se pasan, en el cod original se envia 0,1 en vez de true/false
	await actualizarPrevioPartenariado(demandaId, body.oferta, false, true);

	return partenariado;
});
