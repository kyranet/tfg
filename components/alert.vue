<template>
	<div class="mb-4 mt-6 w-full" role="alert">
		<div class="relative flex">
			<div class="p-4 text-sm"><slot></slot></div>
			<div class="pointer-events-none absolute flex h-full w-full">
				<div class="w-4 shrink-0 rounded-bl-md rounded-tl-md border-b-2 border-l-2 border-t-2" :class="classes.border"></div>
				<div class="relative border-b-2" :class="classes.border">
					<div class="pointer-events-auto flex -translate-y-1/2 place-items-center gap-2 px-2" :class="classes.title">
						<Icon class="h-5 w-5" :name="classes.icon" aria-hidden="true" />
						<span v-if="title" class="font-semibold">{{ title }}</span>
					</div>
				</div>
				<div class="flex-1 rounded-br-md rounded-tr-md border-b-2 border-r-2 border-t-2" :class="classes.border"></div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
const props = defineProps<{ type: 'info' | 'success' | 'warning' | 'danger'; title?: string }>();

const types = {
	info: {
		title: 'text-blue-500',
		border: 'border-blue-500',
		icon: 'fa6-solid:circle-info'
	},
	success: {
		title: 'text-green-500',
		border: 'border-green-500',
		icon: 'fa6-solid:check'
	},
	warning: {
		title: 'text-yellow-600',
		border: 'border-yellow-600',
		icon: 'fa6-solid:triangle-exclamation'
	},
	danger: {
		title: 'text-red-600',
		border: 'border-red-600',
		icon: 'fa6-solid:triangle-exclamation'
	}
} as const;

const classes = computed(() => types[props.type]);
</script>
