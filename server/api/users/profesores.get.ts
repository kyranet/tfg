import { obtenerProfesoresInternos } from '~/server/utils/database/services/daos/daoUsuario';

export default eventHandler(() => {
	return obtenerProfesoresInternos();
});
