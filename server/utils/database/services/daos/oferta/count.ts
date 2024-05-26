import { AnuncioServicio } from '../../types/AnuncioServicio';
import { sharedCountTable } from '../shared';

export function contarTodasOfertasServicio(): Promise<number> {
	return sharedCountTable(AnuncioServicio.Name);
}
