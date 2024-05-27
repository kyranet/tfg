<template>
	<h1 class="mb-4 text-3xl font-semibold">Demandas</h1>

	<alert v-if="role === null" type="warning" title="Atención">
		Estás en la aplicación como invitado. Por favor, <nuxt-link to="/login">inicie sesión</nuxt-link> si desea presentar demandas.
	</alert>
	<div v-else-if="isCommunityPartnerRole(role) || isAdminRole(role)" class="self-end">
		<nuxt-link href="/demandas/crear" class="btn btn-neutral">Crear Demanda</nuxt-link>
	</div>

	<alert v-if="error" type="danger" title="Error">
		{{ error.statusMessage ?? error.message ?? error }}
	</alert>
	<alert v-else-if="!data?.entries.length" type="warning" title="Advertencia">No hay ofertas registradas en el sistema.</alert>

	<div v-if="data">
		{{ data }}
	</div>
</template>

<script setup lang="ts">
useSeoMeta({
	title: 'Demandas',
	description: 'Listado de demandas de la plataforma.'
});

const { data, error } = await useFetch('/api/demandas', { method: 'GET', query: { withCounts: true } });

const role = useAuthRole();
</script>
