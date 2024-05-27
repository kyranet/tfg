import { obtenerUniversidades } from '~/server/utils/database/services/daos/usuario/get';

export default eventHandler(() => {
	return obtenerUniversidades();
});
