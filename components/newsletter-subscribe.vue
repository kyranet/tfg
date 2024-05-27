<template>
	<section class="mt-20 w-full rounded-lg bg-primary text-primary-content">
		<form class="form-subscribe p-4" @submit.prevent="subscribe">
			<h2 class="text-2xl font-bold uppercase">Suscríbete</h2>
			<p>Recibe nuestra newsletter y avisos de proyectos</p>
			<div class="form-subscribe-input">
				<input
					v-model="email"
					type="email"
					name="email"
					placeholder="Introduce tu correo electrónico"
					class="input join-item grow text-base-content"
					required
				/>
				<input type="submit" value="Suscribir" class="btn join-item btn-neutral" />
			</div>
		</form>
	</section>

	<alert v-if="success" type="success" title="Éxito"> Suscripción creada con éxito. </alert>
	<alert v-if="error" type="danger" title="Error">
		{{ error }}
	</alert>
</template>

<script setup lang="ts">
const auth = useAuth();
const email = ref(auth.session.value?.email ?? '');

const success = refAutoReset(false, 30000);
const error = refAutoReset<string | null>(null, 30000);

async function subscribe() {
	try {
		await $fetch('/api/newsletter', { method: 'PUT', body: { email: email.value } });
		success.value = true;
		error.value = null;
	} catch (e: any) {
		success.value = false;
		error.value = String(e.statusMessage ?? e.message ?? e);
	}
}
</script>

<style scoped>
.form-subscribe {
	@apply grid gap-2;
	grid-template-rows: auto auto auto;
	grid-template-columns: 1fr;
	grid-template-areas:
		'a'
		'b'
		'c';
}

@screen lg {
	.form-subscribe {
		grid-template-rows: auto auto;
		grid-template-columns: 1fr 1fr;
		grid-template-areas:
			'a a'
			'b c';
	}
}

.form-subscribe > h2 {
	grid-area: a;
}

.form-subscribe > p {
	grid-area: b;
}

.form-subscribe-input {
	grid-area: c;
	@apply join flex;
}
</style>
