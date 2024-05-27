<template>
	<nuxt-link href="/demandas" class="btn btn-ghost self-start">
		<Icon name="material-symbols:arrow-back" />
		Volver
	</nuxt-link>

	<alert v-if="error" type="danger" title="Error" class="col-span-3">
		No se pudo descargar la demanda seleccionada.
		{{ error.statusMessage ?? error.message ?? error }}
	</alert>

	<div v-if="data" class="w-full max-w-xl">
		<div class="mt-8 rounded-lg bg-base-200 p-4 drop-shadow-lg">
			<h1 class="mb-2 text-2xl font-semibold">Demanda: {{ data.title }}</h1>
			<p class="mb-4 text-sm italic">{{ data.description }}</p>

			<ul>
				<li>
					<Icon name="material-symbols:partner-exchange-outline-rounded" class="-translate-y-0.5" />
					<span class="ml-2 font-semibold">Comunidad beneficiaria:</span> {{ data.beneficiaryCommunity }}
				</li>
				<li>
					<Icon name="material-symbols:date-range-outline-rounded" class="-translate-y-0.5" />
					<span class="ml-2 font-semibold">Creado el</span> {{ useDateTimeFormat(data.createdAt) }}
				</li>
				<li>
					<Icon name="material-symbols:location-on-outline-rounded" class="-translate-y-0.5" />
					<span class="ml-2 font-semibold">{{ data.city }}</span>
				</li>
				<li class="mt-4"><span class="font-semibold">Objetivo:</span> {{ data.purpose }}</li>
				<li><span class="font-semibold">Necesidad social:</span> {{ data.socialNeedName }}</li>
				<li><span class="font-semibold">Observaciones:</span> {{ data.temporaryObservations ?? 'Ninguna' }}</li>
				<li>
					<span class="font-semibold">Áreas de servicio:</span>
					<ul class="ml-4 list-inside list-disc">
						<li v-for="entry of data.serviceAreas" :key="entry">{{ entry }}</li>
					</ul>
				</li>
				<li>
					<span class="font-semibold">Titulaciones necesarias:</span>
					<ul class="ml-4 list-inside list-disc">
						<li v-for="entry of data.degrees" :key="entry">{{ entry }}</li>
					</ul>
				</li>
			</ul>

			<img v-if="data.image" :src="data.image" alt="Imagen" class="mt-4 aspect-[544/150] w-full rounded-lg object-cover" />
		</div>

		<section class="mt-8 rounded-lg bg-base-200 p-4 drop-shadow-lg">
			<h2 class="mb-4 text-xl font-semibold">
				<Icon name="material-symbols:account-balance-outline-rounded" class="-translate-y-0.5" />
				Responsable
			</h2>

			<div class="flex gap-4">
				<avatar :src="data.creatorAvatar" :size="64" class="h-16 w-16 shrink-0 overflow-hidden rounded-full" />
				<ul>
					<li class="flex items-center gap-2 text-lg font-semibold">
						<Icon name="material-symbols:id-card-outline-rounded" />
						{{ data.creatorName }}

						<div class="tooltip" :data-tip="`Link externo a: ${data.creatorUrl}`">
							<nuxt-link :href="data.creatorUrl" class="group btn btn-ghost btn-sm flex text-info">
								<Icon name="material-symbols:link" class="h-6 w-6 rotate-0 transition-transform group-hover:-rotate-45" />
							</nuxt-link>
						</div>
					</li>
					<li class="text-sm italic">{{ data.creatorMission }}</li>
				</ul>
			</div>
		</section>

		<section class="mt-8 rounded-lg bg-base-200 p-4 drop-shadow-lg">
			<h2 class="mb-2 text-lg font-semibold">
				<Icon name="material-symbols:date-range-outline-rounded" class="-translate-y-0.5" />
				Fechas de Definición
			</h2>

			<div class="mx-auto flex max-w-md items-center justify-between gap-4">
				<span class="grow rounded-lg bg-base-300 p-2 text-center">
					{{ data.periodDefinitionStart ? useDateTimeFormat(data.periodDefinitionStart) : 'Sin Definir' }}
				</span>
				<Icon name="material-symbols:arrow-range-rounded" class="h-8 w-8 shrink-0" />
				<span class="grow rounded-lg bg-base-300 p-2 text-center">
					{{ data.periodDefinitionEnd ? useDateTimeFormat(data.periodDefinitionEnd) : 'Sin Definir' }}
				</span>
			</div>

			<h2 class="mb-2 mt-4 text-lg font-semibold">
				<Icon name="material-symbols:date-range-outline-rounded" class="-translate-y-0.5" />
				Fechas de Ejecución
			</h2>

			<div class="mx-auto flex max-w-md items-center justify-between gap-4">
				<span class="grow rounded-lg bg-base-300 p-2 text-center">
					{{ data.periodExecutionStart ? useDateTimeFormat(data.periodExecutionStart) : 'Sin Definir' }}
				</span>
				<Icon name="material-symbols:arrow-range-rounded" class="h-8 w-8 shrink-0" />
				<span class="grow rounded-lg bg-base-300 p-2 text-center">
					{{ data.periodExecutionEnd ? useDateTimeFormat(data.periodExecutionEnd) : 'Sin Definir' }}
				</span>
			</div>

			<h2 class="mb-2 mt-4 text-lg font-semibold">
				<Icon name="material-symbols:date-range-outline-rounded" class="-translate-y-0.5" aria-label="Fecha de" />
				Fecha Límite
			</h2>

			<div class="mx-auto flex max-w-md items-center justify-between gap-4">
				<span class="grow rounded-lg bg-base-300 p-2 text-center">
					{{ data.periodDeadline ? useDateTimeFormat(data.periodDeadline) : 'Sin Definir' }}
				</span>
			</div>
		</section>
	</div>
</template>

<script setup lang="ts">
const endpoint = asTypeParameterizedRoute(`/api/demandas/${useRouteNumber('id')}`);
const { data, error } = await useFetch(endpoint, { method: 'GET' });
if (data.value) {
	defineSeo({
		title: `Demanda - ${data.value.title}`,
		description: data.value.description,
		image: data.value.image ? { url: data.value.image, alt: 'Imagen', width: 128, height: 128 } : undefined
	});
} else {
	defineSeo({ title: 'Demanda no encontrada' });
}
</script>
