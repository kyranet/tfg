import { Newsletter } from '../../types/Newsletter';
import { sharedCountTable } from '../shared';

export function countNewsletters(): Promise<number> {
	return sharedCountTable(Newsletter.Name);
}
