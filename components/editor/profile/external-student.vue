<template>
	<alert v-if="error" type="danger" title="Error" class="col-span-3">
		No se pudo descargar las universidades. Por favor, inténtelo de nuevo más tarde.
		{{ error.statusMessage ?? error.message ?? error }}
	</alert>

	<label class="form-control">
		<div class="label">
			<span class="label-text">Rol</span>
		</div>
		<input type="text" class="input input-bordered w-full" disabled="true" value="Estudiante" />
	</label>

	<label class="form-control">
		<div class="label">
			<span class="label-text">Universidad</span>
		</div>
		<select v-model="university" class="select select-bordered" required :disabled="error !== null || !universities?.length">
			<option disabled :value="null">Selecciona la universidad</option>
			<option v-for="value of universities" :key="value.id" :value="value.id">{{ value.nombre }}</option>
		</select>
	</label>

	<label class="form-control">
		<div class="label">
			<span class="label-text">Titulación</span>
		</div>
		<input v-model="degree" type="text" class="input input-bordered w-full" autocomplete="off" />
	</label>
</template>

<script setup lang="ts">
const props = defineProps<{ university: number; degree: string }>();
const { university, degree } = useVModels(props);

const { data: universities, error } = await useFetch('/api/home/universidades', { method: 'GET' });
</script>
