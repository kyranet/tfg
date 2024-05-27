import { Iniciativa } from '../../types/Iniciativa';
import { sharedDeleteEntryTable } from '../shared';

export function eliminarIniciativa(id: number): Promise<boolean> {
	return sharedDeleteEntryTable(Iniciativa.Name, id);
}
