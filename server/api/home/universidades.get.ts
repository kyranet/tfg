import { obtenerUniversidades } from '~/server/utils/database/services/daos/daoUsuario';

export default eventHandler(async () => {
	return obtenerUniversidades();
});
