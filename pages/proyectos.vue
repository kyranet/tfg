<template>
	<h1 class="mb-4 text-3xl font-semibold">Proyectos</h1>
	<div v-if="error" class="alert alert-error text-error-content">
		<h2 class="font-semibold">Error</h2>
		{{ error.statusMessage ?? error.message ?? error }}
	</div>
	<div v-else-if="!data?.count" class="alert alert-warning text-warning-content">
		<h2 class="font-semibold">Advertencia</h2>
		No hay proyectos registrados en el sistema.
	</div>
	<div v-else>
		{{ data }}
	</div>

	<div class="mt-8 w-full rounded-lg bg-base-200 p-4 drop-shadow-lg">
		<div v-if="data">
			<p>
				<strong>{{ data.count }} resultados</strong> (mostrando del {{ page * 10 + 1 }} al {{ page * 10 + 1 + data.entries.length }})
			</p>
		</div>
		<div v-if="data" class="overflow-x-auto">
			<table class="table table-zebra">
				<!-- head -->
				<thead>
					<tr>
						<th>Profesores</th>
						<th>Entidad</th>
						<th>Estudiantes</th>
						<th>Proyecto</th>
						<th>Acciones</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="entry of data.entries" :key="entry.id">
						<td>
							<div v-for="professor of entry.professors" :key="professor.id" class="badge badge-neutral">
								{{ professor.firstName }} {{ professor.lastName }}
							</div>
						</td>
						<td>{{ entry.offerCreatorName }}</td>
						<td>
							<div v-for="student of entry.students" :key="student.id" class="badge badge-neutral">
								{{ student.firstName }} {{ student.lastName }}
							</div>
						</td>
						<td>{{ entry }}</td>
					</tr>
				</tbody>
			</table>
		</div>

		<div v-if="data" class="join mt-8 w-full justify-center">
			<button class="btn join-item" :disabled="firstPage">
				<Icon name="ph:caret-left-bold" />
				Back
			</button>
			<button class="btn join-item btn-active">1</button>
			<button v-if="pages > 1" class="btn join-item">{{ pages }}</button>
			<button class="btn join-item" :disabled="lastPage">
				Next
				<Icon name="ph:caret-right-bold" />
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
const { data, error } = await useFetch('/api/partenariados', { method: 'GET' });

const pages = computed(() => (data.value ? Math.ceil(data.value.count / 10) : 0));
const page = ref(0);

const firstPage = computed(() => page.value === 0);
const lastPage = computed(() => pages.value <= 1 || page.value === pages.value);
</script>
