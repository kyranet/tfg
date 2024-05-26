import { Colaboracion } from '../../types/Colaboracion';
import { Nota } from '../../types/Nota';
import { Partenariado } from '../../types/Partenariado';
import { Proyecto } from '../../types/Proyecto';
import { sharedDeleteEntryTable } from '../shared';

export function eliminarColaboracion(id: number): Promise<boolean> {
	return sharedDeleteEntryTable(Colaboracion.Name, id);
}

// Eliminar un partenariado
export function eliminarPartenariado(id: number): Promise<boolean> {
	return sharedDeleteEntryTable(Partenariado.Name, id);
}

// Eliminar un proyecto
export function eliminarProyecto(id: number): Promise<boolean> {
	return sharedDeleteEntryTable(Proyecto.Name, id);
}

// Eliminar una nota
export async function eliminarNota(id: number): Promise<boolean> {
	return sharedDeleteEntryTable(Nota.Name, id);
}
