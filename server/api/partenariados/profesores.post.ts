import { crearPartenariado } from '~/server/utils/database/services/daos/daoColaboracion';
import { PartenariadoEstado } from '~/server/utils/database/services/types/Partenariado';
import { PartenariadoBody } from '~/server/utils/validators/Partenariados';

const schemaBody = PartenariadoBody;
export default eventHandler(async (event) => {
	const body = await readValidatedBody(event, schemaBody.parse);
	return crearPartenariado({
		titulo: body.titulo,
		descripcion: body.descripcion,
		admite_externos: body.admiteExternos,
		responsable: body.responsable,
		profesores: body.profesores,
		id_demanda: body.demanda,
		id_oferta: body.oferta,
		estado: PartenariadoEstado.EnCreacion
	});
});
