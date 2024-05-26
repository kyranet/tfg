import { AnuncioServicio } from '../../types/AnuncioServicio';
import { DemandaServicio } from '../../types/DemandaServicio';
import { sharedDeleteEntryTable } from '../shared';

export async function eliminarDemanda(id: number): Promise<boolean> {
	return qb.transaction(
		async (trx) => (await sharedDeleteEntryTable(DemandaServicio.Name, id, trx)) && (await sharedDeleteEntryTable(AnuncioServicio.Name, id, trx))
	);
}
