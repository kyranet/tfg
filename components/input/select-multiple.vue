<template>
	<div class="group relative">
		<button class="input input-bordered w-full text-left" :disabled="disabled">
			<span v-if="selected.length === 0" class="text-base-content/60">{{ tooltip }}</span>
			<span v-for="entry of names" :key="entry.value" class="badge badge-neutral">{{ entry.name }}</span>
		</button>
		<ul
			tabindex="-1"
			class="absolute z-50 hidden max-h-40 w-full overflow-y-auto rounded-lg bg-base-300 p-4 group-focus-within:block group-focus:block group-focus-visible:block"
		>
			<li v-for="entry of entries" class="form-control">
				<label class="label cursor-pointer justify-normal gap-4">
					<input type="checkbox" :value="entry.value" v-model="selected" class="checkbox" />
					<span class="label-text">{{ entry.name }}</span>
				</label>
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts" generic="T extends string | number">
const props = withDefaults(defineProps<{ entries: { name: string; value: T }[]; modelValue?: T[]; disabled?: boolean; tooltip?: string }>(), {
	modelValue: () => []
});
const selected = useVModel(props, 'modelValue');

const names = computed(() => props.entries.filter((entry) => selected.value.includes(entry.value)));
</script>
