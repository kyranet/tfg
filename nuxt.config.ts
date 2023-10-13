import type { SessionConfig } from 'h3';

export default defineNuxtConfig({
	devtools: { enabled: true },
	modules: ['@nuxtjs/tailwindcss', '@vueuse/nuxt', 'nuxt-icon'],
	runtimeConfig: {
		auth: {
			name: 'aps-auth',
			maxAge: 604800,
			password: process.env.AUTH_SECRET ?? '',
			cookie: { sameSite: 'lax' },
			sessionHeader: false
		} as const satisfies SessionConfig
	}
});
