<template>
	<h1 class="mb-4 text-3xl font-semibold">Inicio de sesión</h1>
	<section class="grid gap-4 md:grid-cols-2">
		<div class="rounded-xl border bg-base-200 p-4 drop-shadow-sm">
			<h2 class="text-xl font-semibold">Login UNED</h2>

			<form @submit.prevent="performUnedLogin">
				<label for="login-uned-email" class="form-label mt-2">Correo electrónico</label>
				<input v-model="unedUser" id="login-uned-email" type="email" class="form-input" placeholder="socio@uned.es" />

				<label for="login-uned-password" class="form-label mt-2">Contraseña</label>
				<input v-model="unedPass" id="login-uned-password" type="password" class="form-input" placeholder="Introduzca su contraseña" />

				<div class="mt-2 flex">
					<input v-model="unedRemember" type="checkbox" class="form-checkbox" id="login-uned-remember" />
					<label for="login-uned-remember" class="ml-3 text-sm text-gray-500 dark:text-gray-400">Recordar usuario</label>
				</div>

				<input type="submit" value="Acceder vía SSO UNED" class="button-solid mt-4 w-full" />
			</form>
		</div>

		<div class="rounded-xl border bg-base-200 p-4 drop-shadow-sm">
			<h2 class="text-xl font-semibold">Login externo</h2>

			<form @submit.prevent="performUnedLogin" class="h-full">
				<label for="login-external-email" class="form-label mt-2">Correo electrónico</label>
				<input v-model="externalUser" id="login-external-email" type="email" class="form-input" placeholder="Introduzca su usuario" />

				<label for="login-external-password" class="form-label mt-2">Contraseña</label>
				<input
					v-model="externalPass"
					id="login-external-password"
					type="password"
					class="form-input"
					placeholder="Introduzca su contraseña"
				/>

				<div class="mt-2 flex">
					<input v-model="externalRemember" type="checkbox" class="form-checkbox" id="login-external-remember" />
					<label for="login-external-remember" class="ml-3 text-sm text-gray-500 dark:text-gray-400">Recordar usuario</label>
				</div>

				<input type="submit" value="Iniciar sesión" class="button-solid mt-4 w-full" />
			</form>
		</div>
	</section>
	<div class="mt-4 rounded-xl border bg-base-200 p-4 drop-shadow-sm">
		<h2 class="text-xl font-semibold"><abbr title="Single Sign-On">SSO</abbr> externo - Google (solo estudiantes)</h2>

		TBD.
	</div>
</template>

<script setup lang="ts">
const unedUser = ref('');
const unedPass = ref('');
const unedRemember = ref(false);

const externalUser = ref('');
const externalPass = ref('');
const externalRemember = ref(false);

function performUnedLogin() {}
</script>
