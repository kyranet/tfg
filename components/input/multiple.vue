<template>
	<label class="input input-bordered flex items-center gap-2">
		<div v-if="selected.length !== 0">
			<span v-for="element of selected" :key="element" class="badge badge-ghost">{{ element }}</span>
		</div>
		<input
			v-model.trim="value"
			@keydown="onKeyDown"
			ref="input"
			type="text"
			class="grow border-0 px-0 focus:ring-0"
			:maxlength="maxElementLength"
			:placeholder="placeholder"
		/>
	</label>
	<alert v-if="error" type="warning" title="Atención">
		{{ error }}
	</alert>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ modelValue?: string[]; maxElementLength?: number; maxLength?: number; placeholder?: string }>(), {
	modelValue: () => []
});
const selected = useVModel(props, 'modelValue');

const input = ref<HTMLInputElement>(null!);
const value = ref('');
const error = autoResetRef('', 15000);

function onKeyDown(event: KeyboardEvent) {
	if (event.key === 'Enter') {
		onEnter(event);
	} else if (event.key === 'Backspace') {
		onDelete(event);
	}
}

function onEnter(event: KeyboardEvent) {
	if (!value.value) return;

	event.preventDefault();
	if (selected.value.includes(value.value)) {
		error.value = 'El elemento ya ha sido agregado';
	} else if (props.maxElementLength && value.value.length > props.maxElementLength) {
		error.value = `El elemento no puede tener más de ${props.maxElementLength} caracteres`;
	} else if (props.maxLength && selected.value.length >= props.maxLength) {
		error.value = `No se pueden agregar más de ${props.maxLength} elementos`;
	} else {
		selected.value.push(value.value);
		value.value = '';
		error.value = '';
		input.value.focus();
	}
}

function onDelete(event: KeyboardEvent) {
	if (value.value || !selected.value.length) return;

	event.preventDefault();
	selected.value.pop();
}
</script>
