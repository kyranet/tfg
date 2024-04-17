import { contarIniciativas, contarPartenariados, contarProyectos } from '~/server/utils/database/services/daos/daoColaboracion';

export default eventHandler(async () => {
	const [projects, partnerships, offers] = await Promise.all([
		contarProyectos(), //
		contarPartenariados(),
		contarIniciativas()
	]);

	return { projects, partnerships, offers };
});
