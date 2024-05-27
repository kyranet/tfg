import type { ViewUser } from '~/server/utils/database/services/types/views/User';

export function isStudentRole(role: ViewUser.ValueUserType | null) {
	return role === 'InternalStudent' || role === 'ExternalStudent';
}

export function isProfessorRole(role: ViewUser.ValueUserType | null) {
	return role === 'InternalProfessor' || role === 'ExternalProfessor';
}

export function isCommunityPartnerRole(role: ViewUser.ValueUserType | null) {
	return role === 'CommunityPartner';
}

export function isAdminRole(role: ViewUser.ValueUserType | null) {
	return role === 'Admin';
}
