import { obtenerListaAreasServicio } from '../../utils/database/services/daos/daoDemanda';

// Manejar GET /api/demanda/areasServicio
export default eventHandler(() => {
    return obtenerListaAreasServicio() ;
});
