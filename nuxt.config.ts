import type { SessionConfig } from 'h3';
import type { ConnectionOptions } from 'mysql2';

export default defineNuxtConfig({
	devtools: { enabled: true },
	modules: ['@nuxtjs/tailwindcss', '@vueuse/nuxt', 'nuxt-icon'],
	runtimeConfig: {
		auth: {
			name: 'aps-auth',
			maxAge: 604800,
			password: process.env.NITRO_AUTH_PASSWORD ?? '',
			cookie: { sameSite: 'lax' },
			sessionHeader: false
		} as const satisfies SessionConfig,
		db: {
			host: process.env.NITRO_DB_HOST ?? 'localhost',
			user: process.env.NITRO_DB_USER ?? 'admin',
			password: process.env.NITRO_DB_PASSWORD ?? 'admin',
			database: process.env.NITRO_DB_DATABASE ?? 'aps',
			port: process.env.NITRO_DB_PORT ? Number(process.env.NITRO_DB_PORT) : 3306,
			multipleStatements: true
		} as const satisfies ConnectionOptions
	}
});
