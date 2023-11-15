<template>
	<section class="prose max-w-none">
		<h1>Sobre ApS UNED - Contacta</h1>
	</section>

	<form class="mt-8 rounded-xl border bg-base-200 p-4 drop-shadow-sm" @submit.prevent="">
		<p class="text-sm">Por favor, rellena el siguiente formulario para contactar con nosotros.</p>
		<hr />

		<div class="mt-4 grid gap-4 md:grid-cols-2">
			<div>
				<label for="contact-first-name" class="form-label">Nombre</label>
				<input
					id="contact-first-name"
					v-model="formFirstName"
					type="text"
					autocomplete="given-name"
					class="form-input"
					placeholder="Introduce tu nombre"
					required
				/>
			</div>
			<div>
				<label for="contact-last-name" class="form-label">Apellidos</label>
				<input
					id="contact-last-name"
					v-model="formLastName"
					type="email"
					autocomplete="family-name"
					class="form-input"
					placeholder="Introduce tus apellidos"
					required
				/>
			</div>
			<div>
				<label for="contact-email" class="form-label">Correo electrónico</label>
				<input
					id="contact-email"
					v-model="formEmail"
					type="email"
					autocomplete="email"
					class="form-input"
					placeholder="socio@uned.es"
					required
				/>
			</div>
			<div>
				<label for="contact-kind" class="form-label">Área sobre la que trata el mensaje</label>
				<select id="contact-kind" v-model="formKind" class="form-input">
					<option :value="0">Pregunta sin categorizar</option>
					<option :value="1">Sugerir oferta</option>
					<option :value="2">Problema con la aplicación</option>
					<option :value="3">Relacionado con el sistema de registro y login</option>
				</select>
			</div>
		</div>

		<label for="contact-message" class="form-label mt-4">Correo electrónico</label>
		<textarea id="contact-message" v-model="formMessage" class="form-input" placeholder="Escribe lo que quieras contarnos" required></textarea>

		<button type="submit" class="button-solid mt-4">Enviar mensaje</button>
	</form>
</template>

<script setup lang="ts">
const formFirstName = ref('');
const formLastName = ref('');
const formEmail = ref('');
const formKind = ref(0);
const formMessage = ref('');
</script>
