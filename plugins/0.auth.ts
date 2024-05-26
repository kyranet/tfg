import type { ViewUser } from '~/server/utils/database/services/types/views/User';

export default defineNuxtPlugin(async (nuxtApp) => {
	// Skip plugin when rendering error page
	if (nuxtApp.payload.error) {
		return {};
	}

	const { data: session, refresh: updateSession } = await useFetch('/api/auth/session', { key: 'session' });
	const loggedIn = computed(() => Boolean(session.value?.id));

	// Create a ref to know where to redirect the user when logged in
	const redirectTo = useState<string>('authRedirect', () => '/');

	// Add global route middleware to protect pages using:
	// definePageMeta({ auth: true });
	addRouteMiddleware(
		'auth',
		(to) => {
			if (to.meta.auth && !loggedIn.value) {
				redirectTo.value = to.path;
				return '/login';
			}
		},
		{ global: true }
	);

	addRouteMiddleware(
		'roles',
		(to) => {
			if (!to.meta.roles?.length) return;

			if (!loggedIn.value) {
				redirectTo.value = to.path;
				return '/login';
			}

			if (!to.meta.roles.includes(session.value!.role)) {
				return '/';
			}
		},
		{ global: true }
	);

	const currentRoute = useRoute();
	if (process.client) {
		watch(loggedIn, async (loggedIn) => {
			if (!loggedIn && currentRoute.meta.auth) {
				redirectTo.value = currentRoute.path;
				await navigateTo('/login');
			}
		});
	}

	return {
		provide: {
			auth: {
				loggedIn,
				session,
				redirectTo,
				updateSession
			}
		}
	};
});

declare module '#app' {
	interface PageMeta {
		auth?: boolean;
		roles?: ViewUser.ValueUserType[];
	}
}

declare module 'vue-router' {
	interface PageMeta {
		auth?: boolean;
		roles?: ViewUser.ValueUserType[];
	}
}
