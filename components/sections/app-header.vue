<template>
	<header class="mb-4 bg-base-200 p-2 drop-shadow-sm">
		<div class="layout-container flex justify-between">
			<nav class="flex gap-1">
				<NuxtLink href="/" class="nav-item" tabindex="0">Inicio</NuxtLink>
				<NuxtLink href="/info/que-es" class="nav-item" tabindex="0">¿Qué es el ApS?</NuxtLink>
				<NuxtLink href="/proyectos" class="nav-item" tabindex="0">Proyectos</NuxtLink>
				<div class="hs-dropdown relative inline-flex">
					<button
						id="hs-dropdown-default"
						type="button"
						class="hs-dropdown-toggle nav-item inline-flex items-center justify-center gap-2 rounded align-middle"
					>
						ApS UNED
						<Icon name="material-symbols:keyboard-arrow-down" size="16" class="text-gray-600 hs-dropdown-open:rotate-180" />
					</button>

					<div
						class="hs-dropdown-menu z-10 mt-2 hidden w-72 min-w-[15rem] rounded-lg bg-white p-2 opacity-0 shadow-md transition-[opacity,margin] duration-[0.1ms] hs-dropdown-open:opacity-100 dark:divide-gray-700 dark:border dark:border-gray-700 dark:bg-gray-800"
						aria-labelledby="hs-dropdown-default"
					>
						<NuxtLink
							v-for="item of items"
							:key="item.url"
							class="flex items-center gap-x-3.5 rounded-md px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
							:href="item.url"
						>
							{{ item.title }}
						</NuxtLink>
					</div>
				</div>
			</nav>
			<nav v-if="auth.loggedIn.value">
				<button class="nav-item" @click="authLogout()">Cerrar Sesión</button>
			</nav>
			<nav v-else class="flex gap-1">
				<NuxtLink href="/registro" class="nav-item" tabindex="0">Registro</NuxtLink>
				<NuxtLink href="/login" class="nav-item" tabindex="0">Login</NuxtLink>
			</nav>
		</div>
	</header>
</template>

<script setup lang="ts">
const items = [
	{ title: 'Quiénes somos', url: '/info/quienes-somos' },
	{ title: 'Historia', url: '/info/historia' },
	{ title: 'Contacta', url: '/info/contacta' }
];

const auth = useAuth();
</script>

<style scoped>
.nav-item {
	@apply rounded px-4 py-3 text-sm font-medium text-gray-700 transition-all hover:bg-base-300 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white dark:bg-slate-900 dark:text-gray-400 dark:hover:bg-slate-800 dark:hover:text-white dark:focus:ring-offset-gray-800;
}
</style>
