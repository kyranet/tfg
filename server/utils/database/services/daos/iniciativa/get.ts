import { Iniciativa } from '../../types/Iniciativa';
import type { SearchParameters } from '../shared';

export async function getInitiative(id: number) {
	return ensureDatabaseEntry(
		await qb(Iniciativa.Name).where({ id }).select(InitiativeSelect).first(),
		'No se pudo encontrar la iniciativa con el ID proporcionado'
	);
}

export async function searchInitiatives(search: SearchParameters) {
	return await qb(Iniciativa.Name)
		.select(InitiativeSelect)
		.limit(search.limit ?? 100)
		.offset(search.offset ?? 0);
}

const InitiativeSelect = {
	id: 'id',
	title: 'titulo',
	description: 'descripcion',
	studentId: 'id_estudiante',
	demandId: 'id_demanda',
	socialNeed: 'necesidad_social'
} as const;
