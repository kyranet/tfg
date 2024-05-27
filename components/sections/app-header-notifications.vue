<template>
	<nuxt-link to="/@me/resumen" class="btn btn-ghost">
		<div v-if="error" class="tooltip tooltip-bottom" :data-tip="String(error.statusMessage ?? error.message ?? error)">
			<Icon name="ph:bell-bold" class="h-6 w-6 text-error" />
		</div>
		<div v-else-if="data" class="indicator">
			<span
				v-show="data.length > 0"
				role="alert"
				class="badge indicator-item badge-info badge-xs m-1"
				:aria-label="`${data.length} notifications`"
				>{{ data.length }}</span
			>
			<Icon name="ph:bell-bold" class="h-6 w-6" />
		</div>
	</nuxt-link>
</template>

<script setup lang="ts">
const { data, error } = await useFetch('/api/notificaciones', { method: 'GET' });
</script>
