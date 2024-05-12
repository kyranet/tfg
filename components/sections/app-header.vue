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
				</ul>
			</div>
			<nuxt-link to="/" class="btn btn-ghost text-xl">ApS</nuxt-link>
		</div>
		<div class="navbar-center hidden lg:flex">
			<ul class="menu menu-horizontal px-1">
				<li><nuxt-link to="/info/que-es">¿Qué es el ApS?</nuxt-link></li>
				<li><nuxt-link to="/proyectos">Proyectos</nuxt-link></li>
				<li>
					<details>
						<summary>ApS {{ organization }}</summary>
						<ul class="p-2">
							<li v-for="item of items">
								<nuxt-link :to="item.url">{{ item.title }}</nuxt-link>
							</li>
						</ul>
					</details>
				</li>
			</ul>
		</div>
		<div class="navbar-end">
			<ul class="menu menu-horizontal px-1">
				<li v-if="auth.loggedIn.value">
					<details>
						<summary class="flex">
							<div class="flex flex-col">
								<span class="font-normal">{{ auth.session.value!.firstName }} {{ auth.session.value!.lastName }}</span>
								<span class="font-bold">{{ RoleMapping[auth.session.value!.role] }}</span>
							</div>
							<picture class="h-10 w-10 overflow-hidden rounded-full bg-base-300">
								<img
									v-show="!avatarLoading && !avatarError"
									:src="auth.session.value!.avatar"
									alt="Avatar"
									onload="avatarLoading = false"
									onerror="avatarError = true"
								/>
								<Icon
									v-if="avatarLoading || avatarError"
									name="ph:user-fill"
									class="h-10 w-10 translate-y-1.5 text-base-200 drop-shadow-lg"
								/>
							</picture>
						</summary>
						<ul class="p-2">
							<li v-for="item of loggedInItems">
								<nuxt-link :to="item.url">{{ item.title }}</nuxt-link>
							</li>
							<button tabindex="0" class="btn btn-ghost" @click="authLogout()">Cerrar Sesión</button>
						</ul>
					</details>
				</li>
				<template v-else>
					<nuxt-link to="/registro" tabindex="0" class="btn btn-ghost">Registro</nuxt-link>
					<nuxt-link to="/login" tabindex="0" class="btn btn-ghost">Login</nuxt-link>
				</template>
			</ul>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { ViewUser } from '~/server/utils/database/services/types/views/User';

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

const auth = useAuth();
const avatarLoading = ref(true);
const avatarError = ref(false);

const { organization } = useRuntimeConfig().public;

const RoleMapping = {
	Admin: 'Administrador',
	InternalStudent: 'Estudiante',
	ExternalStudent: 'Estudiante',
	InternalProfessor: 'Profesor',
	ExternalProfessor: 'Profesor',
	CommunityPartner: 'Socio Comunitario',
	ApSOffice: 'Oficina ApS',
	Collaborator: 'Colaborador',
	Tutor: 'Tutor CA'
} satisfies Record<ViewUser.ValueUserType, string>;
</script>

<style scoped>
.navbar :deep(a),
.navbar :deep(summary),
.navbar :deep(button) {
	@apply text-sm font-medium;
}
</style>
