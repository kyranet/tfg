import { Usuario } from '../../types/Usuario';
import { sharedCountTable } from '../shared';

export function countUsers() {
	return sharedCountTable(Usuario.Name);
}
