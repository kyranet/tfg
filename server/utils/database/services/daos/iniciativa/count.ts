import { Iniciativa } from '../../types/Iniciativa';
import { sharedCountTable } from '../shared';

export function countInitiatives() {
	return sharedCountTable(Iniciativa.Name);
}
