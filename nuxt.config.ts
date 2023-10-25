import type { SessionConfig } from 'h3';
import type { ConnectionOptions } from 'mysql2';

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
		} as const satisfies SessionConfig,
		db: {
			host: process.env.DB_HOST ?? 'localhost',
			port: process.env.DB_PORT ? Number(process.env.DB_HOST) : 3306,
			user: process.env.DB_USER ??'admin',
			password: process.env.DB_PASS ?? 'admin',
			database: process.env.DB_DB ?? 'aps',
			multipleStatements: true
		} as const satisfies ConnectionOptions
	}
});
