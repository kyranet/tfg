import { obtenerProfesores } from '~/server/utils/database/services/daos/daoUsuario';

export default eventHandler(() => {
	return obtenerProfesores();
});
