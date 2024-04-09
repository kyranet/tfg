import { z } from 'zod';
import { CoercedIntegerId } from '~/server/utils/validators/shared';

const schemaParams = z.object({ id: CoercedIntegerId });
const schemaBody = z.object({ mensaje: z.string() });
export default eventHandler(async (event) => {
	const { id } = await getValidatedRouterParams(event, schemaParams.parse);
	const body = await readValidatedBody(event, schemaBody.parse);
	const user = await requireAuthSession(event);

	const mensaje = {
		texto: body.mensaje,
		uid: user.data.id,
		email: user.data.email,
		nombre: user.data.nombre,
		apellidos: user.data.apellidos,
		rol: user.data.rol,
		fecha: new Date()
	};

	await Partenariado.updateOne({ _id: id }, { $push: { mensajes: { $each: [mensaje], $position: 0 } } });
	return mensaje;
});
