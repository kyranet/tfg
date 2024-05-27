import { DemandaServicio } from '../../types/DemandaServicio';
import { sharedCountTable } from '../shared';

export function contarTodasDemandasServicio(): Promise<number> {
	return sharedCountTable(DemandaServicio.Name);
}
