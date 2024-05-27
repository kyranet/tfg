<template>
	<section class="prose max-w-none">
		<h1>Sobre ApS - Contacta</h1>
	</section>

	<form class="mt-8 max-w-screen-md rounded-lg bg-base-200 p-4 drop-shadow-lg" @submit.prevent="">
		<p class="text-sm">Por favor, rellena el siguiente formulario para contactar con nosotros.</p>
		<hr />

		<div class="mt-4 grid md:grid-cols-2 md:gap-4">
			<label class="form-control w-full">
				<div class="label">
					<span class="label-text">Nombre *</span>
				</div>
				<input
					v-model="formFirstName"
					type="text"
					placeholder="Introduzca su nombre"
					autocomplete="given-name"
					class="input input-bordered w-full"
					required
				/>
			</label>

			<label class="form-control w-full">
				<div class="label">
					<span class="label-text">Apellidos *</span>
				</div>
				<input
					v-model="formLastName"
					type="text"
					placeholder="Introduzca sus apellidos"
					autocomplete="family-name"
					class="input input-bordered w-full"
					required
				/>
			</label>

			<label class="form-control w-full">
				<div class="label">
					<span class="label-text">Correo electrónico *</span>
				</div>
				<input
					v-model="formEmail"
					type="email"
					placeholder="Introduzca su correo electrónico"
					autocomplete="email"
					class="input input-bordered w-full"
					required
				/>
			</label>

			<label class="form-control w-full">
				<div class="label">
					<span class="label-text">Área sobre la que trata el mensaje *</span>
				</div>
				<select v-model="formKind" class="select select-bordered" required>
					<option :value="0">Pregunta sin categorizar</option>
					<option :value="1">Sugerir oferta</option>
					<option :value="2">Problema con la aplicación</option>
					<option :value="3">Relacionado con el sistema de registro y login</option>
				</select>
			</label>
		</div>

		<label class="form-control w-full">
			<div class="label">
				<span class="label-text">Mensaje *</span>
			</div>
			<textarea
				v-model="formMessage"
				placeholder="Escribe lo que quieras contarnos"
				autocomplete="off"
				class="input input-bordered w-full"
				required
			></textarea>
		</label>

		<button type="submit" class="btn btn-neutral mt-4">Enviar mensaje</button>
	</form>
</template>

<script setup lang="ts">
const formFirstName = ref('');
const formLastName = ref('');
const formEmail = ref('');
const formKind = ref(0);
const formMessage = ref('');
</script>
