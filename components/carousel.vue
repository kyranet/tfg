<template>
	<div class="carousel" @keydown="onKeyDown">
		<Transition v-for="(item, i) of items" :key="i" name="fade">
			<div
				v-show="i === slideIndex"
				:id="`carousel-panel-${i}`"
				ref="slideTabs"
				:key="i"
				role="tabpanel"
				:aria-labelledby="`carousel-tab-${i}`"
				:hidden="i !== slideIndex"
				tabindex="0"
				class="relative"
				draggable="false"
			>
				<img :src="item.src" :alt="item.text" aria-hidden="true" class="carousel-panel" />
				<div class="carousel-text">{{ item.text }}</div>
			</div>
		</Transition>

		<div class="carousel-arrows">
			<button aria-label="Navegar al panel anterior" @click="nextSlide(false)">
				<Icon name="material-symbols:keyboard-arrow-left" size="45" aria-hidden="true" />
			</button>

			<button aria-label="Navegar al panel siguiente" @click="nextSlide(true)">
				<Icon name="material-symbols:keyboard-arrow-right" size="45" aria-hidden="true" />
			</button>
		</div>

		<div class="carousel-bottom">
			<div class="carousel-tabs" role="tablist" aria-label="Selector de pestañas">
				<button
					v-for="(item, i) of items"
					:id="`carousel-tab-${i}`"
					:key="i"
					role="tab"
					:aria-label="`Navegar a &quot;${item.text}&quot;`"
					:aria-selected="slideIndex === i"
					:aria-controls="`carousel-panel-${i}`"
					:tabindex="slideIndex === i ? 0 : -1"
					class="carousel-tab"
					@click="changeSlideIndex(i)"
				>
					<svg viewBox="0 0 30 3" xmlns="http://www.w3.org/2000/svg" width="30" height="3" aria-hidden="true">
						<rect width="30" height="3" />
					</svg>
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
const props = defineProps<{ items: { src: string; text: string }[] }>();

const slideIndex = ref(0);
const slideTabs = ref<HTMLDivElement[]>();

function changeSlideIndex(index: number) {
	slideIndex.value = index;
	// eslint-disable-next-line ts/no-use-before-define
	start();
	return index;
}

function nextSlide(forward: boolean) {
	return forward
		? changeSlideIndex(slideIndex.value === props.items.length - 1 ? 0 : slideIndex.value + 1)
		: changeSlideIndex(slideIndex.value === 0 ? props.items.length - 1 : slideIndex.value - 1);
}

function onKeyDown(event: KeyboardEvent) {
	let index: number | null = null;
	if (event.key === 'ArrowLeft') {
		index = nextSlide(false);
	} else if (event.key === 'ArrowRight') {
		index = nextSlide(true);
	}

	if (index !== null) {
		console.log(slideTabs.value);
		void nextTick(() => slideTabs.value![index!].focus());
	}
}

const { start } = useTimeoutFn(() => {
	nextSlide(true);
}, 15000);
</script>

<style>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.5s ease;
}

.fade-leave-active {
	position: absolute;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0.5;
}
</style>

<style scoped>
.carousel {
	@apply relative max-h-[450px] w-full;
}

.carousel-panel {
	@apply z-0;
}

.carousel-bottom {
	@apply absolute bottom-0 z-[1] w-full;
}

.carousel-text {
	@apply absolute bottom-[34px] z-[1] w-full px-8 text-center text-3xl font-semibold text-white;
}

.carousel-tabs {
	@apply flex justify-center fill-white;
}

.carousel-tab {
	transition: opacity 150ms;
	@apply px-1.5 py-4;
}

.carousel-tab[aria-selected='false'] {
	@apply opacity-50;
}

.carousel-tab[aria-selected='false']:hover {
	@apply opacity-75;
}

.carousel-arrows {
	@apply absolute top-0 z-0 flex h-full w-full items-center justify-between text-white;
}

.carousel-arrows > button {
	transition: opacity 150ms;
	@apply h-fit p-4 opacity-25;
}

.carousel-arrows > button:hover,
.carousel-arrows > button:focus {
	@apply opacity-100;
}
</style>
