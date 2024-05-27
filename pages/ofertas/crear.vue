<template>
	<h1 class="mb-4 text-3xl font-semibold">Crear Oferta</h1>
	<form @submit.prevent="performRequest" class="w-full max-w-screen-md">
		<div class="rounded-lg bg-base-200 p-4 drop-shadow-lg">
			<label class="form-control w-full">
				<div class="label">
					<span class="label-text">Título *</span>
				</div>
				<input
					v-model="title"
					type="text"
					placeholder="Título corto y descriptivo"
					autocomplete="off"
					required
					maxlength="200"
					class="input input-bordered w-full"
				/>
			</label>

			<label class="form-control w-full">
				<div class="label">
					<span class="label-text">Descripción *</span>
				</div>
				<textarea
					v-model="description"
					placeholder="Descripción detallada de la oferta"
					autocomplete="off"
					required
					maxlength="1200"
					class="textarea textarea-bordered w-full"
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
					<span class="label-text">Asignatura objetivo *</span>
				</div>
				<input-multiple v-model="subjects" :max-length="10" :max-element-length="200" placeholder="Escriba una lista de asignaturas" />
			</label>

			<label class="form-control w-full">
				<div class="label">
					<span class="label-text">Tags</span>
				</div>
				<input-multiple v-model="tags" :max-length="10" :max-element-length="32" placeholder="Escriba una lista de tags" />
			</label>
		</div>

		<div class="mt-8 rounded-lg bg-base-200 p-4 drop-shadow-lg">
			<label class="form-control w-full">
				<div class="label">
					<span class="label-text">Fecha límite para definir el proyecto</span>
				</div>
				<input
					v-model="deadline"
					type="date"
					placeholder="Título corto y descriptivo"
					autocomplete="off"
					maxlength="200"
					class="input input-bordered w-full"
				/>
			</label>

			<label class="form-control w-full">
				<div class="label">
					<span class="label-text">Cuatrimestre Objetivo</span>
				</div>
				<select v-model="quarter" class="select select-bordered">
					<option :value="null">Sin definir</option>
					<option :value="1">Primer cuatrimestre</option>
					<option :value="2">Segundo cuatrimestre</option>
					<option :value="3">Anual</option>
				</select>
			</label>

			<label class="form-control w-full">
				<div class="label">
					<span class="label-text">Año académico objetivo</span>
				</div>
				<input
					v-model.number="academicYear"
					type="number"
					placeholder="Año académico"
					autocomplete="off"
					class="input input-bordered w-full"
					:min="currentYear"
				/>
			</label>
		</div>

		<div class="mt-8 rounded-lg bg-base-200 p-4 drop-shadow-lg">
			<label class="form-control w-full">
				<div class="label">
					<span class="label-text">Si tiene alguna petición especial en cuanto a las fechas, por favor escríbalo aquí</span>
				</div>
				<textarea
					v-model="remarks"
					placeholder="Escribe cualquier observación temporal que consideres adecuada"
					autocomplete="off"
					maxlength="1200"
					class="textarea textarea-bordered w-full"
				></textarea>
			</label>
		</div>

		<alert type="info" title="Información" class="mt-12">
			Una vez la oferta haya sido creada, se podrán subir archivos e imágenes a la misma, así como editar sus datos básicos.
		</alert>

		<div class="mt-8 flex justify-between">
			<nuxt-link to="/ofertas" class="btn btn-ghost">
				<Icon name="material-symbols:arrow-back" />
				Volver
			</nuxt-link>

			<button type="submit" class="btn btn-primary">Crear Oferta</button>
		</div>

		<alert v-if="error" type="danger" title="Error" class="mt-12">
			{{ error }}
		</alert>
	</form>
</template>

<script setup lang="ts">
import type { PageMeta } from '#app';

definePageMeta({ auth: true, roles: ['InternalProfessor', 'ExternalProfessor', 'CommunityPartner', 'Admin'] } satisfies PageMeta);

const { data: serviceAreaEntries, error: serviceAreasError } = await useFetch('/api/ofertas/areas-servicio', { method: 'GET' });

const currentYear = new Date().getFullYear();

const title = ref('');
const description = ref('');
const subjects = ref<string[]>([]);
const quarter = ref<number | null>(null);
const academicYear = ref<number | null>(null);
const deadline = ref<string | null>(null);
const remarks = ref('');
const serviceAreas = ref<number[]>([]);
const tags = ref<string[]>([]);

const router = useRouter();
const error = autoResetRef<string | null>(null, 15000);
async function performRequest() {
	try {
		const entry = await $fetch('/api/ofertas', {
			method: 'POST',
			body: {
				title: title.value,
				description: description.value,
				subjects: subjects.value,
				quarter: quarter.value,
				academicYear: academicYear.value,
				deadline: deadline.value,
				remarks: remarks.value,
				serviceAreas: serviceAreas.value,
				tags: tags.value
			}
		});

		await router.push(`/ofertas/${entry.id}`);
	} catch (e: any) {
		console.log(e);
		error.value = String(e.statusMessage ?? e.message ?? e);
	}
}
</script>
