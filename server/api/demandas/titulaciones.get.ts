import { obtenerListaTitulacionLocal } from '~/server/utils/database/services/daos/demanda/get';

export default eventHandler(() => {
	return obtenerListaTitulacionLocal();
});
