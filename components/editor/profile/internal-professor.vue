<template>
	<alert v-if="error" type="danger" title="Error" class="col-span-3">
		No se pudo descargar las universidades. Por favor, inténtelo de nuevo más tarde.
		{{ error.statusMessage ?? error.message ?? error }}
	</alert>

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
const props = defineProps<{ knowledgeAreas: number[] }>();
const { knowledgeAreas } = useVModels(props);

const { data: knowledgeAreaEntries, error: knowledgeAreaError } = await useFetch('/api/knowledge-areas', { method: 'GET' });
const error = computed(() => knowledgeAreaError.value);

const selection = computed(() => knowledgeAreaEntries.value?.map((area) => ({ name: area.nombre, value: area.id })) ?? []);
</script>
