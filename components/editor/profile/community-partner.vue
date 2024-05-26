<template>
	<label class="form-control">
		<div class="label">
			<span class="label-text">Rol</span>
		</div>
		<input type="text" class="input input-bordered w-full" disabled="true" value="Socio Comunitario" />
	</label>

	<label class="form-control">
		<div class="label">
			<span class="label-text">Sector</span>
		</div>
		<input
			v-model="sector"
			type="text"
			placeholder="Introduzca el sector de su institución"
			autocomplete="off"
			required
			class="input input-bordered w-full"
		/>
	</label>
	<label class="form-control">
		<div class="label">
			<span class="label-text">URL</span>
		</div>
		<input
			v-model="url"
			type="url"
			placeholder="Introduzca la URL de su institución"
			autocomplete="url"
			required
			class="input input-bordered w-full"
		/>
	</label>
	<label class="form-control">
		<div class="label">
			<span class="label-text">Misión</span>
		</div>
		<input
			v-model="mission"
			type="text"
			placeholder="Introduzca la misión de su institución"
			autocomplete="work"
			required
			class="input input-bordered w-full"
		/>
	</label>
	<label class="form-control">
		<div class="label">
			<span class="label-text">Nombre</span>
		</div>
		<input
			v-model="name"
			type="text"
			placeholder="Introduzca el nombre de su institución"
			autocomplete="organization"
			required
			class="input input-bordered w-full"
		/>
	</label>
</template>

<script setup lang="ts">
const props = defineProps<{ sector: string; url: string; mission: string; name: string }>();
const { sector, url, mission, name } = useVModels(props);
</script>
