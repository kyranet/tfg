import { obtenerListaNecesidadSocial } from '~/server/utils/database/services/daos/demanda/get';

export default eventHandler(() => {
	return obtenerListaNecesidadSocial();
});
