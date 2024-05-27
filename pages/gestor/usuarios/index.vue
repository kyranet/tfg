<template>
	<h1 class="mb-4 text-3xl font-semibold">Gestor de Usuarios</h1>

	<alert v-if="error" type="danger" title="Error" class="col-span-3">
		No se pudo descargar la lista de usuarios. Por favor, inténtelo de nuevo más tarde.
		{{ error.statusMessage ?? error.message ?? error }}
	</alert>

	<label class="form-control w-full">
		<div class="label">
			<span class="label-text">Filtro</span>
		</div>
		<div class="join w-full">
			<input v-model="query" type="text" class="input join-item input-bordered grow" placeholder="Buscar usuario" />
			<button class="btn btn-outline join-item" :disabled="skipPreviousDisabled">Anteriores</button>
			<button class="btn btn-outline join-item" :disabled="skipNextDisabled">Siguientes</button>
		</div>
		<div class="label">
			<span class="label-text-alt">{{ data?.total ?? 0 }} entradas</span>
		</div>
	</label>

	<div v-if="data" class="w-full overflow-x-auto">
		<table class="table">
			<!-- head -->
			<thead>
				<tr>
					<th>Usuario</th>
					<th>Rol</th>
					<th>Acciones</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="entry of data.users" :key="entry.id" class="hover">
					<td class="flex items-center gap-4">
						<div class="mask mask-circle h-12 w-12 shrink-0">
							<avatar :src="entry.avatar" :size="64" />
						</div>
						<div class="grid gap-1">
							<span class="font-semibold"> {{ entry.firstName }} {{ entry.lastName }} </span>
							<span class="badge badge-ghost badge-sm">{{ entry.email }}</span>
						</div>
					</td>
					<td>
						{{ UserRoleMapping[entry.role] }}
					</td>
					<th>
						<div class="join">
							<nuxt-link :href="isSelf(entry.id) ? '/@me' : `/gestor/usuarios/${entry.id}`" class="btn btn-ghost join-item">
								<Icon name="material-symbols:edit-rounded" aria-label="Editar" class="h-6 w-6" />
							</nuxt-link>
							<button
								class="btn btn-ghost join-item text-error disabled:bg-transparent"
								:disabled="isSelf(entry.id)"
								@click="onDelete(entry as any)"
							>
								<Icon name="material-symbols:delete-forever-rounded" aria-label="Borrar" class="h-6 w-6" />
							</button>
						</div>
					</th>
				</tr>
			</tbody>
			<!-- foot -->
			<tfoot>
				<tr>
					<th>Usuario</th>
					<th>Rol</th>
					<th>Acciones</th>
				</tr>
			</tfoot>
		</table>
	</div>

	<dialog ref="dialogElement" class="modal" @click="onDialogClick">
		<div class="modal-box">
			<h3 class="text-lg font-bold">¡Atención!</h3>
			<p class="py-4">Esta acción es permanente, ¿desea proceder al borrado del usuario?</p>
			<div v-if="deleting" class="rounded-xl bg-base-200 p-4 drop-shadow-lg">
				<div class="flex items-center gap-4">
					<div class="mask mask-circle h-12 w-12 shrink-0">
						<avatar :src="deleting.avatar" :size="64" />
					</div>
					<div class="grid gap-1">
						<span class="font-semibold"> {{ deleting.firstName }} {{ deleting.lastName }} </span>
						<span class="badge badge-ghost badge-sm">{{ deleting.email }}</span>
					</div>
				</div>

				<ul class="mt-4">
					<li>
						<span class="font-semibold">Rol</span>:
						{{ UserRoleMapping[deleting.role] }}
					</li>
					<li>
						<span class="font-semibold">Fecha de Creación</span>:
						{{ useDateTimeFormat(deleting.createdAt) }}
					</li>
					<li>
						<span class="font-semibold">Teléfono</span>:
						{{ deleting.phone }}
					</li>
				</ul>
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
import type { ViewUser } from '~/server/utils/database/services/types/views/User';

definePageMeta({ auth: true, roles: ['Admin'] } satisfies PageMeta);
definePrivateAreaSeo({ title: 'Gestor de Usuarios' });

const skip = ref(0);
const limit = ref(25);
const query = ref('');
const { data, error } = useFetch('/api/users', { method: 'GET', query: { query, skip, limit } });

watch(query, () => (skip.value = 0));

const skipPreviousDisabled = computed(() => skip.value === 0);
const skipNextDisabled = computed(() => (data.value ? data.value.users.length < limit.value : true));

const auth = useAuth();

const dialogElement = ref<HTMLDialogElement>(null!);
const deleting = ref<ViewUser.Value | null>(null);

function onDelete(user: ViewUser.Value) {
	deleting.value = user;
	dialogElement.value.showModal();
}

function isSelf(id: number) {
	return auth.session.value?.id === id;
}

async function onConfirmDelete() {
	if (!deleting.value) return;

	try {
		// @ts-expect-error False positive, there is a 'DELETE' method in the route
		await $fetch(`/api/users/${deleting.value.id}`, { method: 'delete' });

		if (data.value) {
			data.value = {
				...data.value,
				users: data.value.users.filter((user) => user.id !== deleting.value?.id)
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
