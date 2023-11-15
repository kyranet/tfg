<template>
	<div class="flex h-screen flex-col">
		<div class="flex-auto justify-between">
			<SectionsAppHeader />
			<main class="layout-container">
				<slot></slot>
			</main>
		</div>
		<SectionsAppFooter />
	</div>
</template>

<script setup lang="ts">
if (process.client) {
	// @ts-expect-error preline does not ship types
	await import('preline');
}
</script>
