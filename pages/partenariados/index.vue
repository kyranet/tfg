<template>
	<h1 class="mb-4 text-3xl font-semibold">Partenariados</h1>
	<alert v-if="error" type="danger" title="Error">
		{{ error.statusMessage ?? error.message ?? error }}
	</alert>
	<alert v-else-if="!data?.entries.length" type="warning" title="Advertencia" class="w-full">No hay partenariados registrados en el sistema.</alert>
	<div v-else>
		{{ data }}
	</div>
</template>

<script setup lang="ts">
const { data, error } = await useFetch('/api/partenariados', { method: 'GET' });
</script>
