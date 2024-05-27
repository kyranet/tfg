<template>
	<h1 class="mb-4 text-3xl font-semibold">Ofertas</h1>
	<alert v-if="error" type="danger" title="Error" class="w-full">
		{{ error.statusMessage ?? error.message ?? error }}
	</alert>
	<alert v-else-if="!data?.ofertas.length" type="warning" title="Advertencia" class="w-full">No hay ofertas registradas en el sistema.</alert>
	<div v-else>
		{{ data }}
	</div>
</template>

<script setup lang="ts">
const { data, error } = await useFetch('/api/ofertas', { method: 'GET' });
</script>
