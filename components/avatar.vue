<template>
	<img ref="imageElement" v-if="src" v-show="!shouldDisplayDefault" :src="src" alt="Avatar" @load="onLoad" @error="onError" />
	<icons-avatar-default v-show="shouldDisplayDefault" />
</template>

<script setup lang="ts">
const props = defineProps<{ src: string | null }>();
const src = computed(() => (props.src ? `/avatars/${props.src}` : null));

const imageElement = ref<HTMLImageElement>(null!);
const loading = ref(true);
const errored = ref(false);

const shouldDisplayDefault = computed(() => !src || loading.value || errored.value);

function onLoad() {
	loading.value = false;
	errored.value = false;
}

function onError() {
	loading.value = false;
	errored.value = true;
}
</script>
