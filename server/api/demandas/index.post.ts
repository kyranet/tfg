import { crearDemanda } from '~/server/utils/database/services/daos/demanda/insert';
import { DemandaBody } from '~/server/utils/validators/Demandas';

const schemaBody = DemandaBody;
export default eventHandler(async (event) => {
	const user = await requireAuthRole(event, ['CommunityPartner']);
	const body = await readValidatedBody(event, schemaBody.parse);

	return crearDemanda({ ...body, creator: user.data.id });
});
