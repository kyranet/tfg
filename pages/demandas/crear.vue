<template>
	<h1 class="mb-4 text-3xl font-semibold">Crear Demanda</h1>
	<nuxt-link href="/demandas" class="btn btn-ghost self-start">
		<Icon name="material-symbols:arrow-back" />
		Volver
	</nuxt-link>

	<alert v-if="!isCommunityPartnerRole(role)" type="warning" title="Advertencia">
		La creación de demandas solo está disponible para entidades colaboradoras.
	</alert>

	<alert v-if="serviceAreasError" type="danger" title="Error">
		No se pudo cargar las áreas de servicio. Por favor, inténtelo de nuevo más tarde.
		{{ serviceAreasError.statusMessage ?? serviceAreasError.message ?? serviceAreasError }}
	</alert>
	<alert v-if="socialNeedError" type="danger" title="Error">
		No se pudo cargar las áreas de servicio. Por favor, inténtelo de nuevo más tarde.
		{{ socialNeedError.statusMessage ?? socialNeedError.message ?? socialNeedError }}
	</alert>
	<alert v-if="degreeError" type="danger" title="Error">
		No se pudo cargar las áreas de servicio. Por favor, inténtelo de nuevo más tarde.
		{{ degreeError.statusMessage ?? degreeError.message ?? degreeError }}
	</alert>

	<form class="w-full" @submit.prevent="performRequest">
		<alert type="info" title="Información">
			En esta página puedes crear una demanda de servicio para que los profesores puedan estudiarla y decidir si participar en ella.
		</alert>
		<div class="mt-8 rounded-lg bg-base-200 p-4 drop-shadow-lg">
			<label class="form-control w-full">
				<div class="label">
					<span class="label-text">Título *</span>
				</div>
				<input
					v-model="title"
					type="text"
					placeholder="Introduzca el título para la demanda"
					autocomplete="off"
					class="input input-bordered w-full"
					required
				/>
			</label>

			<label class="form-control w-full">
				<div class="label">
					<span class="label-text">Descripción *</span>
				</div>
				<textarea
					v-model="description"
					type="text"
					placeholder="Introduzca la descripción para la demanda"
					autocomplete="off"
					class="textarea textarea-bordered w-full"
					required
				></textarea>
			</label>

			<label class="form-control w-full">
				<div class="label">
					<span class="label-text">Area de implementación *</span>
				</div>
				<input-select-multiple
					v-model="serviceAreas"
					:entries="serviceAreaEntries?.map((v) => ({ name: v.nombre, value: v.id })) ?? []"
					:disabled="serviceAreasError !== null || !serviceAreaEntries?.length"
					tooltip="Selecciona el area de servicio"
				/>
			</label>

			<label class="form-control w-full">
				<div class="label">
					<span class="label-text">Localización</span>
				</div>
				<input v-model="city" type="text" placeholder="Introduzca la localización" autocomplete="off" class="input input-bordered w-full" />
			</label>

			<label class="form-control w-full">
				<div class="label">
					<span class="label-text">Objetivo a cumplir *</span>
				</div>
				<input
					v-model="purpose"
					type="text"
					placeholder="Introduzca el objetivo a cumplir"
					autocomplete="off"
					class="input input-bordered w-full"
					required
				/>
			</label>
		</div>

		<div class="mt-8 rounded-lg bg-base-200 p-4 drop-shadow-lg">
			<h2 class="mb-4 text-2xl font-semibold">
				<Icon name="material-symbols:groups-2-rounded" class="-translate-y-0.5" />
				Beneficiarios
			</h2>

			<label class="form-control w-full">
				<div class="label">
					<span class="label-text">Necesidad social a cumplir *</span>
				</div>
				<select v-model="socialNeed" class="select select-bordered" required>
					<option disabled :value="null">Introduzca la necesidad social</option>
					<option v-for="entry of socialNeedEntries" :value="entry.id">{{ entry.nombre }}</option>
				</select>
			</label>

			<label class="form-control w-full">
				<div class="label">
					<span class="label-text">Comunidad beneficiaria *</span>
				</div>
				<input
					v-model="beneficiaryCommunity"
					type="text"
					placeholder="Introduzca la comunidad beneficiaria"
					autocomplete="off"
					class="input input-bordered w-full"
					required
				/>
			</label>

			<label class="form-control w-full">
				<div class="label">
					<span class="label-text">Titulación(es) en las que podría cuadrar el proyecto</span>
				</div>
				<input-select-multiple
					v-model="degrees"
					:entries="degreeEntries?.map((v) => ({ name: v.nombre, value: v.id })) ?? []"
					:disabled="degreeError !== null || !degreeEntries?.length"
					tooltip="Introduzca la(s) titulación(es)"
				/>
			</label>
		</div>

		<div class="relative -z-10 mt-8 rounded-lg bg-base-200 p-4 drop-shadow-lg">
			<h2 class="mb-4 text-2xl font-semibold">
				<Icon name="material-symbols:calendar-month-outline-rounded" class="-translate-y-0.5" />
				Fechas
			</h2>

			<div class="grid md:grid-cols-2 md:gap-2">
				<label class="form-control w-full">
					<div class="label">
						<span class="label-text">Comienzo del periodo para definir el proyecto</span>
					</div>
					<input v-model="periodDefinitionStart" type="datetime-local" autocomplete="off" class="input input-bordered w-full" />
				</label>

				<label class="form-control w-full">
					<div class="label">
						<span class="label-text">Fin del periodo para definir el proyecto</span>
					</div>
					<input v-model="periodDefinitionEnd" type="datetime-local" autocomplete="off" class="input input-bordered w-full" />
				</label>
			</div>

			<div class="grid md:grid-cols-2 md:gap-2">
				<label class="form-control w-full">
					<div class="label">
						<span class="label-text">Comienzo del periodo para realizar el proyecto</span>
					</div>
					<input v-model="periodExecutionStart" type="datetime-local" autocomplete="off" class="input input-bordered w-full" />
				</label>

				<label class="form-control w-full">
					<div class="label">
						<span class="label-text">Fin del periodo para realizar el proyecto</span>
					</div>
					<input v-model="periodExecutionEnd" type="datetime-local" autocomplete="off" class="input input-bordered w-full" />
				</label>
			</div>

			<label class="form-control w-full">
				<div class="label">
					<span class="label-text">Fecha límite para realizar el proyecto</span>
				</div>
				<input v-model="periodDeadline" type="datetime-local" autocomplete="off" class="input input-bordered w-full" />
			</label>
		</div>

		<button type="submit" class="btn btn-primary mt-8" :disabled="!isCommunityPartnerRole(role)">
			<Icon name="material-symbols:add-circle-outline" />
			Crear demanda
		</button>

		<alert v-if="error" type="danger" title="Error">
			{{ error }}
		</alert>
	</form>
</template>

<script setup lang="ts">
import type { PageMeta } from '#app';

definePageMeta({ auth: true, roles: ['Admin', 'CommunityPartner'] } satisfies PageMeta);
definePrivateAreaSeo({ title: 'Crear Demanda' });

const role = useAuthRole();

const city = ref('');
const purpose = ref('');
const periodDefinitionStart = ref('');
const periodDefinitionEnd = ref('');
const periodExecutionStart = ref('');
const periodExecutionEnd = ref('');
const periodDeadline = ref('');
const temporaryObservations = ref('');
const beneficiaryCommunity = ref('');
const title = ref('');
const description = ref('');
const socialNeed = ref<number | null>(null);
const serviceAreas = ref<number[]>([]);
const degrees = ref<number[]>([]);

const { data: serviceAreaEntries, error: serviceAreasError } = await useFetch('/api/ofertas/areas-servicio', { method: 'GET' });
const { data: socialNeedEntries, error: socialNeedError } = await useFetch('/api/demandas/necesidades');
const { data: degreeEntries, error: degreeError } = await useFetch('/api/demandas/titulaciones');

const router = useRouter();
const error = refAutoReset<string | null>(null, 30000);
async function performRequest() {
	try {
		const entry = await $fetch('/api/demandas', {
			method: 'POST',
			body: {
				city: city.value,
				purpose: purpose.value,
				periodDefinitionStart: periodDefinitionStart.value || null,
				periodDefinitionEnd: periodDefinitionEnd.value || null,
				periodExecutionStart: periodExecutionStart.value || null,
				periodExecutionEnd: periodExecutionEnd.value || null,
				periodDeadline: periodDeadline.value || null,
				temporaryObservations: temporaryObservations.value || null,
				beneficiaryCommunity: beneficiaryCommunity.value,
				title: title.value,
				description: description.value,
				socialNeed: socialNeed.value,
				serviceAreas: serviceAreas.value,
				degrees: degrees.value
			}
		});

		await router.push(`/demandas/${entry.id}`);
	} catch (e: any) {
		error.value = String(e.statusMessage ?? e.message ?? e);
	}
}
</script>
