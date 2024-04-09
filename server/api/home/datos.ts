import { contarIniciativas, contarPartenariados, contarProyectos } from '~/server/utils/database/services/daos/daoColaboracion';

export default eventHandler(async () => {
	const [proyectos, partenariados, ofertas] = await Promise.all([contarProyectos(), contarPartenariados(), contarIniciativas()]);

	return {
		proyectos,
		partenariados,
		ofertas
	};
});
