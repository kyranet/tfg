<template>
	<alert v-if="error" type="danger" title="Error" class="col-span-3">
		No se pudo descargar las titulaciones. Por favor, inténtelo de nuevo más tarde.
		{{ error.statusMessage ?? error.message ?? error }}
	</alert>

	<label class="form-control">
		<div class="label">
			<span class="label-text">Universidad</span>
		</div>
		<select v-model="degree" class="select select-bordered" required :disabled="error !== null || !entries?.length">
			<option disabled :value="null">Selecciona la titulación</option>
			<option v-for="entry of entries" :key="entry.id" :value="entry.id">{{ entry.nombre }}</option>
		</select>
	</label>
</template>

<script setup lang="ts">
const props = defineProps<{ degree: number }>();
const { degree } = useVModels(props);

const { data: entries, error } = await useFetch('/api/demandas/titulaciones', { method: 'GET' });
</script>
