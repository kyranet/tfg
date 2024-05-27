<template>
	<div class="navbar bg-base-100">
		<div class="navbar-start">
			<div class="dropdown">
				<div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
					</svg>
				</div>
				<ul tabindex="0" class="menu dropdown-content menu-sm z-[1] mt-3 w-52 rounded-box bg-base-100 p-2 shadow">
					<li><nuxt-link to="/info/que-es">¿Qué es el ApS?</nuxt-link></li>
					<li><nuxt-link to="/proyectos">Proyectos</nuxt-link></li>
					<li>
						<a>ApS {{ organization }}</a>
						<ul class="p-2">
							<li v-for="item of items">
								<nuxt-link :to="item.url">{{ item.title }}</nuxt-link>
							</li>
						</ul>
					</li>
					<li v-if="auth.session.value?.role === 'Admin'">
						<a>Zona Gestor</a>
						<ul class="p-2">
							<li v-for="item of adminItems">
								<nuxt-link :to="item.url">{{ item.title }}</nuxt-link>
							</li>
						</ul>
					</li>
				</ul>
			</div>
			<nuxt-link to="/" class="btn btn-ghost text-xl">ApS</nuxt-link>
		</div>
		<div class="navbar-center hidden lg:flex">
			<ul class="menu menu-horizontal px-1">
				<li><nuxt-link to="/info/que-es">¿Qué es el ApS?</nuxt-link></li>
				<li><nuxt-link to="/proyectos">Proyectos</nuxt-link></li>
				<li class="dropdown dropdown-end">
					<div tabindex="0" role="button" class="gap-0 font-semibold">
						ApS {{ organization }}
						<Icon name="material-symbols:arrow-drop-down-rounded" class="h-5 w-5" />
					</div>
					<ul tabindex="0" class="menu dropdown-content menu-sm z-[1] mt-3 w-52 rounded-box bg-base-100 p-2 shadow">
						<li v-for="item of items">
							<nuxt-link :to="item.url">{{ item.title }}</nuxt-link>
						</li>
					</ul>
				</li>
				<li v-if="auth.session.value?.role === 'Admin'" class="dropdown dropdown-end">
					<div tabindex="0" role="button" class="gap-0 font-semibold">
						Zona Gestor
						<Icon name="material-symbols:arrow-drop-down-rounded" class="h-5 w-5" />
					</div>
					<ul tabindex="0" class="menu dropdown-content menu-sm z-[1] mt-3 w-52 rounded-box bg-base-100 p-2 shadow">
						<li v-for="item of adminItems">
							<nuxt-link :to="item.url">{{ item.title }}</nuxt-link>
						</li>
					</ul>
				</li>
			</ul>
		</div>
		<div class="navbar-end">
			<template v-if="auth.loggedIn.value">
				<sections-app-header-notifications />
				<div class="dropdown dropdown-end">
					<div tabindex="0" role="button" class="btn btn-ghost flex-nowrap">
						<div class="flex shrink flex-col gap-1">
							<span class="truncate font-normal">{{ auth.session.value!.firstName }} {{ auth.session.value!.lastName }}</span>
							<span class="truncate font-bold">{{ UserRoleMapping[auth.session.value!.role] }}</span>
						</div>
						<avatar :src="avatarId" :size="64" class="h-10 w-10 overflow-hidden rounded-full" />
					</div>
					<ul tabindex="0" class="menu dropdown-content menu-sm z-[1] mt-3 w-52 rounded-box bg-base-100 p-2 shadow">
						<li v-for="item of loggedInItems">
							<nuxt-link :to="item.url">{{ item.title }}</nuxt-link>
						</li>
						<li>
							<button tabindex="0" class="" @click="authLogout()">Cerrar Sesión</button>
						</li>
					</ul>
				</div>
			</template>
			<ul v-else class="menu menu-horizontal px-1">
				<li><nuxt-link to="/registro" tabindex="0" class="btn btn-ghost">Registro</nuxt-link></li>
				<li><nuxt-link to="/login" tabindex="0" class="btn btn-ghost">Login</nuxt-link></li>
			</ul>
		</div>
	</div>
</template>

<script setup lang="ts">
const items = [
	{ title: 'Quiénes somos', url: '/info/quienes-somos' },
	{ title: 'Historia', url: '/info/historia' },
	{ title: 'Contacta', url: '/info/contacta' }
];

const loggedInItems = [
	{ title: 'Resumen', url: '/@me/resumen' },
	{ title: 'Mis Ofertas', url: '/@me/ofertas' },
	{ title: 'Mis Proyectos', url: '/@me/proyectos' },
	{ title: 'Editar Perfil', url: '/@me' }
];

const adminItems = [
	{ title: 'Usuarios', url: '/gestor/usuarios' },
	{ title: 'Emails', url: '/gestor/emails' },
	{ title: 'Suscripciones', url: '/gestor/suscripciones' }
];

const auth = useAuth();
const avatarId = computed(() => auth.session.value?.avatar ?? null);

const { organization } = useRuntimeConfig().public;
</script>

<style scoped>
.navbar :deep(a),
.navbar :deep(summary),
.navbar :deep(button) {
	@apply text-sm font-medium;
}
</style>
