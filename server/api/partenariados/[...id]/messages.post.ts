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
		uid: user.id,
		email: user.email,
		nombre: user.nombre,
		apellidos: user.apellidos,
		rol: user.rol,
		fecha: new Date()
	};

	await Partenariado.updateOne({ _id: id }, { $push: { mensajes: { $each: [mensaje], $position: 0 } } });
	return mensaje;
});
