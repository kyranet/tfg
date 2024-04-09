import { crearPartenariado } from '~/server/utils/database/services/daos/daoColaboracion';
import { Partenariado, PartenariadoStatus } from '~/server/utils/database/services/types/Partenariado';
import { PartenariadoBody } from '~/server/utils/validators/Partenariados';

const schemaBody = PartenariadoBody;
export default eventHandler(async (event) => {
	const body = await readValidatedBody(event, schemaBody.parse);
	const partenariado: Partenariado = {
		id: null!,
		titulo: body.titulo,
		descripcion: body.descripcion,
		admite_externos: body.admiteExternos,
		responsable: body.responsable,
		profesores: body.profesores,
		id_demanda: body.demanda,
		id_oferta: body.oferta,
		estado: PartenariadoStatus.EnCreacion
	};
	const id = await crearPartenariado(partenariado);
	return { ...partenariado, id };
});
