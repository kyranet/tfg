<template>
	<div class="flex h-screen flex-col">
		<div class="flex-auto justify-between">
			<sections-app-header />
			<main class="layout-container">
				<slot></slot>
			</main>
		</div>
		<sections-app-footer />
	</div>
</template>

<script setup lang="ts">
if (process.client) {
	// @ts-expect-error preline does not ship types
	await import('preline');
}
</script>
