export const useAuth = () => useNuxtApp().$auth;

export async function authLogout() {
	await $fetch('/api/auth/logout', { method: 'POST' });
	useAuth().session.value = null;
}
