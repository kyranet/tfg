import { obtenerSociosComunitarios } from '~/server/utils/database/services/daos/usuario/get';

export default eventHandler(() => {
	return obtenerSociosComunitarios();
});
