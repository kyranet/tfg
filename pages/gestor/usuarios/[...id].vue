<template>
	<nuxt-link href="/gestor/usuarios" class="btn btn-ghost self-start">
		<Icon name="material-symbols:arrow-back" />
		Volver
	</nuxt-link>

	<alert v-if="error" type="danger" title="Error" class="col-span-3">
		No se pudo descargar el usuario seleccionado.
		{{ error.statusMessage ?? error.message ?? error }}
	</alert>

	{{ user }}
</template>

<script setup lang="ts">
import type { PageMeta } from '#app';

definePageMeta({ auth: true, roles: ['Admin'] } satisfies PageMeta);

const endpoint = asTypeParameterizedRoute(`/api/users/${useRouteNumber('id')}`);
const { data: user, error } = await useFetch(endpoint, { method: 'GET' });
if (user.value) {
	definePrivateAreaSeo({ title: `Editando ${user.value.firstName} ${user.value.lastName}` });
} else {
	definePrivateAreaSeo({ title: 'Usuario no encontrado' });
}
</script>
