import { resolve } from 'node:path';
import type { Upload } from '../../types/Upload';

export const RootAvatar = resolve('./data/avatars');
export const RootInitiativeDefault = resolve('./data/initiatives/default');
export const RootInitiativeFiles = resolve('./data/initiatives/files');
export const RootPartnershipFiles = resolve('./data/partnerships/files');
export const RootProjectFiles = resolve('./data/projects/files');

export function getLocalFileUploadRoot(type: Upload['tipo'], field: Upload['campo']) {
	if (type === 'usuarios' && field === 'avatar') return RootAvatar;
	if (type === 'iniciativas' && field === 'default') return RootInitiativeDefault;
	if (type === 'iniciativas' && field === 'archivos') return RootInitiativeFiles;
	if (type === 'partenariados' && field === 'archivos') return RootPartnershipFiles;
	if (type === 'proyectos' && field === 'archivos') return RootProjectFiles;
	throw new Error('Invalid type or field');
}
