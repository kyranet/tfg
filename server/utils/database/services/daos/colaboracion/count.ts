import { AnuncioServicio } from '../../types/AnuncioServicio';
import { OfertaServicio } from '../../types/OfertaServicio';
import { Partenariado } from '../../types/Partenariado';
import { Proyecto } from '../../types/Proyecto';
import { sharedCountTable } from '../shared';

export function countProjects(): Promise<number> {
	return sharedCountTable(Proyecto.Name);
}

export function contarPartenariados(): Promise<number> {
	return sharedCountTable(Partenariado.Name);
}

export function contarIniciativas(): Promise<number> {
	return sharedCountTable(OfertaServicio.Name);
}

export async function contarOfertas(): Promise<number> {
	return sharedCountTable(AnuncioServicio.Name);
}

export function countPartnerships(): Promise<number> {
	return sharedCountTable(Partenariado.Name);
}
