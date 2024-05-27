<template>
	<picture class="bg-base-300">
		<source v-if="src" type="image/webp" :srcset="srcsetWebp" />
		<source v-if="src" type="image/png" :srcset="srcsetPng" />
		<object v-if="src" :data="src" type="image/png" class="h-full w-full">
			<icons-avatar-default />
		</object>
		<icons-avatar-default v-else />
	</picture>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ src: string | null; size: 64 | 128 | 256 | 512; densities?: number[] }>(), {
	densities: () => [1, 2]
});
const src = computed(() => (props.src ? `/avatars/${props.src}.webp` : null));

const sizes = computed(() => props.densities.map((density) => ({ suffix: `${density}x`, size: props.size * density })));

const srcsetWebp = makeGroupIconSrcset('webp');
const srcsetPng = makeGroupIconSrcset('png');

function makeGroupIconSrcset(format: 'webp' | 'png') {
	return computed(() => sizes.value.map(({ size, suffix }) => `/avatars/${props.src}.${format}?size=${size} ${suffix}`).join(', '));
}
</script>
