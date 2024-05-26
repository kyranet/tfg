<template>
	<alert v-if="error" type="danger" title="Error" class="col-span-3">
		No se pudo descargar las universidades. Por favor, inténtelo de nuevo más tarde.
		{{ error.statusMessage ?? error.message ?? error }}
	</alert>

	<label class="form-control">
		<div class="label">
			<span class="label-text">Rol</span>
		</div>
		<input type="text" class="input input-bordered w-full" disabled="true" value="Profesor" autocomplete="off" />
	</label>

	<label class="form-control">
		<div class="label">
			<span class="label-text">Universidad</span>
		</div>
		<select v-model="university" class="select select-bordered" required :disabled="universityError !== null || !universityEntries?.length">
			<option disabled :value="null">Selecciona la universidad</option>
			<option v-for="value of universityEntries" :key="value.id" :value="value.id">{{ value.nombre }}</option>
		</select>
	</label>

	<label class="form-control">
		<div class="label">
			<span class="label-text">Facultad</span>
		</div>
		<input v-model="faculty" type="text" class="input input-bordered w-full" autocomplete="off" />
	</label>

	<label class="form-control">
		<div class="label">
			<span class="label-text">Area/s de conocimiento UNESCO</span>
		</div>
		<input-select-multiple
			v-model="knowledgeAreas"
			:entries="selection"
			:disabled="selection.length === 0"
			tooltip="Selecciona la/s área/s de conocimiento"
		/>
	</label>
</template>

<script setup lang="ts">
const props = defineProps<{ university: number; faculty: string; knowledgeAreas: number[] }>();
const { university, faculty, knowledgeAreas } = useVModels(props);

const { data: universityEntries, error: universityError } = await useFetch('/api/home/universidades', { method: 'GET' });
const { data: knowledgeAreaEntries, error: knowledgeAreaError } = await useFetch('/api/knowledge-areas', { method: 'GET' });
const error = computed(() => universityError.value ?? knowledgeAreaError.value);

const selection = computed(() => knowledgeAreaEntries.value?.map((area) => ({ name: area.nombre, value: area.id })) ?? []);
</script>
