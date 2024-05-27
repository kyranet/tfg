<template>
	<h1 class="mb-4 text-3xl font-semibold">Gestor de Suscripciones</h1>

	<alert v-if="error" type="danger" title="Error">
		No se pudo descargar la lista de usuarios. Por favor, inténtelo de nuevo más tarde.
		{{ error.statusMessage ?? error.message ?? error }}
	</alert>
	<alert v-else-if="!data?.entries.length" type="warning" title="Advertencia">No hay suscripciones registradas en el sistema.</alert>

	<label class="form-control w-full">
		<div class="label">
			<span class="label-text">Filtro</span>
		</div>
		<div class="join w-full">
			<input v-model="email" type="text" class="input join-item input-bordered w-[inherit] grow" placeholder="Buscar usuario" />
			<button class="btn btn-outline join-item" :disabled="skipPreviousDisabled">Anteriores</button>
			<button class="btn btn-outline join-item" :disabled="skipNextDisabled">Siguientes</button>
		</div>
		<div class="label">
			<span class="label-text-alt">{{ data?.count ?? 0 }} entradas</span>
		</div>
	</label>

	<div v-if="data" class="w-full overflow-x-auto">
		<table class="table">
			<!-- head -->
			<thead>
				<tr>
					<th>Email</th>
					<th>Fecha</th>
					<th>Acciones</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="entry of data.entries" :key="entry.id" class="hover">
					<td>
						{{ entry.mailTo }}
					</td>
					<td>
						{{ useDateTimeFormat(entry.createdAt) }}
					</td>
					<th>
						<button class="btn btn-ghost join-item text-error disabled:bg-transparent" @click="onDelete(entry as any)">
							<Icon name="material-symbols:delete-forever-rounded" aria-label="Borrar" class="h-6 w-6" />
						</button>
					</th>
				</tr>
			</tbody>
			<!-- foot -->
			<tfoot>
				<tr>
					<th>Email</th>
					<th>Fecha</th>
					<th>Acciones</th>
				</tr>
			</tfoot>
		</table>
	</div>

	<dialog ref="dialogElement" class="modal" @click="onDialogClick">
		<div class="modal-box">
			<h3 class="text-lg font-bold">¡Atención!</h3>
			<p class="py-4">Esta acción es permanente, ¿desea proceder al borrado de la suscripción?</p>
			<div v-if="deleting" class="rounded-xl bg-base-200 p-4 drop-shadow-lg">
				<table class="table">
					<!-- head -->
					<thead>
						<tr>
							<th>Email</th>
							<th>Fecha</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>
								{{ deleting.mailTo }}
							</td>
							<td>
								{{ useDateTimeFormat(deleting.createdAt) }}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div class="modal-action">
				<form method="dialog">
					<button class="btn btn-error rounded-r-none" @click="onConfirmDelete">Borrar</button>
					<button class="btn rounded-l-none" @click="onConfirmCancel">Cerrar</button>
				</form>
			</div>
		</div>
	</dialog>
</template>

<script setup lang="ts">
import type { PageMeta } from '#app';
import type { FormattedNewsletter } from '~/server/utils/database/services/daos/comunicacion/_shared';

definePageMeta({ auth: true, roles: ['Admin'] } satisfies PageMeta);
definePrivateAreaSeo({ title: 'Gestor de Suscripciones' });

const skip = ref(0);
const limit = ref(25);
const email = ref('');

const { data, error } = await useFetch('/api/newsletter', {
	method: 'GET',
	query: { skip, limit, email, withCounts: true }
});

const skipPreviousDisabled = computed(() => skip.value === 0);
const skipNextDisabled = computed(() => (data.value ? data.value.entries.length < limit.value : true));

const dialogElement = ref<HTMLDialogElement>(null!);
const deleting = ref<FormattedNewsletter | null>(null);

function onDelete(user: FormattedNewsletter) {
	deleting.value = user;
	dialogElement.value.showModal();
}

async function onConfirmDelete() {
	if (!deleting.value) return;

	try {
		const id = deleting.value.id;
		const endpoint = asTypeParameterizedRoute(`/api/newsletter/${id}`);
		await $fetch(endpoint, { method: 'DELETE' });

		if (data.value) {
			data.value = {
				...data.value,
				entries: data.value.entries.filter((entry) => entry.id !== id)
			};
		}
	} catch (e) {
		error.value = e as any;
	}
}

function onConfirmCancel() {
	deleting.value = null;
}

function onDialogClick(event: MouseEvent) {
	if (event.target === dialogElement.value) {
		onConfirmCancel();
		dialogElement.value.close();
	}
}
</script>
