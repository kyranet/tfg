import type { ViewUser } from '~/server/utils/database/services/types/views/User';

export const useAuth = () => useNuxtApp().$auth;

export async function authLogout() {
	await $fetch('/api/auth/logout', { method: 'POST' });
	useAuth().session.value = null;
}

export function useAuthUserId(): ComputedRef<number | null> {
	const auth = useAuth();
	return computed(() => (auth.loggedIn.value ? auth.session.value!.id : null));
}

export function useAuthRole(): ComputedRef<ViewUser.ValueUserType | null> {
	const auth = useAuth();
	return computed(() => (auth.loggedIn.value ? auth.session.value!.role : null));
}
