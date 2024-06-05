<template>
	<alert v-if="error" type="danger" title="Error" class="mt-12">
		<template v-if="error.statusCode === 404"> No se ha encontrado la oferta solicitada. </template>
		<template v-else>
			{{ error.statusMessage ?? error.message ?? error }}
		</template>
	</alert>

	<alert v-else-if="isStudentRole(role)" type="warning" title="Atención">
		Estás viendo esta página como estudiante. Solo los profesores pueden presentar ofertas.
	</alert>
	<alert v-else-if="isCommunityPartnerRole(role)" type="warning" title="Atención">
		Estás viendo esta página como entidad. Solo los profesores pueden presentar ofertas.
	</alert>
	<alert v-else-if="isProfessorRole(role) && data?.creator.id !== userId" type="warning" title="Atención">
		Estás viendo esta página como profesor, pero esta oferta ha sido presentada por otra persona.
	</alert>

	<div v-if="data" class="rounded-lg bg-base-200 p-4 drop-shadow-lg">
		<h1 class="mb-4 text-3xl font-semibold">Oferta: {{ data.title }}</h1>
		<div class="flex">
			<div></div>
			<div></div>
		</div>
		{{ data }}
	</div>
</template>

<script setup lang="ts">
import type { PageMeta } from '#app';

definePageMeta({ auth: true } satisfies PageMeta);

const userId = useAuthUserId();
const role = useAuthRole();
const endpoint = asTypeParameterizedRoute(`/api/ofertas/${useRouteNumber('id')}`);
const { data, error } = await useFetch(endpoint, { method: 'GET' });
</script>
