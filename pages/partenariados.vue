<template>
	<h1 class="mb-4 text-3xl font-semibold">Partenariados</h1>
	<div v-if="error" class="alert alert-error text-error-content">
		<h2 class="font-semibold">Error</h2>
		{{ error.statusMessage ?? error.message ?? error }}
	</div>
	<div v-else-if="!data?.entries.length" class="alert alert-warning text-warning-content">
		<h2 class="font-semibold">Advertencia</h2>
		No hay partenariados registrados en el sistema.
	</div>
	<div v-else>
		{{ data }}
	</div>
</template>

<script setup lang="ts">
const { data, error } = await useFetch('/api/partenariados', { method: 'GET' });
</script>
