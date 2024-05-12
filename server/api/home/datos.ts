import { contarIniciativas, contarPartenariados, countProjects } from '~/server/utils/database/services/daos/daoColaboracion';

export default eventHandler(async () => {
	const [projects, partnerships, offers] = await Promise.all([
		countProjects(), //
		contarPartenariados(),
		contarIniciativas()
	]);

	return { projects, partnerships, offers };
});
