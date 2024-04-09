import { obtenerListaNecesidadSocial } from '~/server/utils/database/services/daos/daoDemanda';

export default eventHandler(() => {
	return obtenerListaNecesidadSocial();
});
