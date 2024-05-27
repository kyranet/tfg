<template>
	<h1 class="mb-4 text-3xl font-semibold">Formulario de registro</h1>
	<div class="prose mt-8 w-full max-w-screen-md rounded-lg bg-base-200 p-4 text-left drop-shadow-lg">
		<h2 class="text-xl font-semibold">Selección de perfil de usuario</h2>
		<p>En esta página puedes registrarte dentro de la aplicación <strong>Portal ApS</strong>.</p>
		<p>
			Si deseas utilizar tu cuenta de la {{ organization }}, no es necesario que te registres, entra en la pantalla
			<nuxt-link to="/login">Login</nuxt-link> y utiliza el SSO de la {{ organization }}.
		</p>

		<form @submit.prevent="performRequest">
			<div class="grid md:grid-cols-2 md:gap-4">
				<label class="form-control w-full">
					<div class="label">
						<span class="label-text">Nombre</span>
					</div>
					<input
						v-model="firstName"
						type="text"
						placeholder="Introduzca su nombre"
						autocomplete="given-name"
						required
						class="input input-bordered w-full"
					/>
				</label>

				<label class="form-control w-full">
					<div class="label">
						<span class="label-text">Apellidos</span>
					</div>
					<input
						v-model="lastName"
						type="text"
						placeholder="Introduzca sus apellidos"
						autocomplete="family-name"
						required
						class="input input-bordered w-full"
					/>
				</label>

				<label class="form-control w-full">
					<div class="label">
						<span class="label-text">Correo electrónico</span>
					</div>
					<input
						v-model="email"
						type="email"
						placeholder="Introduzca su correo"
						autocomplete="email"
						required
						class="input input-bordered w-full"
					/>
				</label>

				<label class="form-control w-full">
					<div class="label">
						<span class="label-text">Teléfono</span>
					</div>
					<input
						v-model.number="phone"
						type="tel"
						placeholder="Introduzca su teléfono"
						autocomplete="tel"
						required
						class="input input-bordered w-full"
					/>
				</label>
			</div>

			<div class="grid md:mt-4 md:grid-cols-2 md:gap-4">
				<label class="form-control w-full">
					<div class="label">
						<span class="label-text">Contraseña</span>
					</div>
					<input
						v-model="password"
						type="password"
						placeholder="Introduzca su contraseña"
						autocomplete="new-password"
						required
						minlength="6"
						class="input input-bordered w-full"
						@change="onPasswordUpdate"
					/>
				</label>
				<label class="form-control w-full">
					<div class="label">
						<span class="label-text">Repetir contraseña</span>
					</div>
					<input
						ref="inputRepeatPassword"
						v-model="repeatPassword"
						type="password"
						placeholder="Repita su contraseña"
						autocomplete="new-password"
						required
						minlength="6"
						class="input input-bordered w-full"
						@change="onPasswordUpdate"
					/>
				</label>
			</div>

			<label class="form-control mt-4 w-full">
				<div class="label">
					<span class="label-text"
						>Perfil de Usuario (<nuxt-link to="/como-participar/estudiantes">Estudiantes</nuxt-link>,
						<nuxt-link to="/como-participar/profesores">Profesores</nuxt-link>,
						<nuxt-link to="/como-participar/socios-comunitarios">Socios comunitarios</nuxt-link>)</span
					>
				</div>
				<select v-model="type" class="select select-bordered" required>
					<option disabled :value="null">Elegir un tipo de perfil</option>
					<option value="ExternalStudent">Estudiante</option>
					<option value="ExternalProfessor">Profesor</option>
					<option value="CommunityPartner">Socio Comunitario</option>
				</select>
			</label>

			<template v-if="type === 'ExternalStudent'">
				<hr class="mb-4 mt-8" />
				<editor-profile-external-student v-model:university="studentUniversity" v-model:degree="studentDegree" />
			</template>
			<template v-else-if="type === 'ExternalProfessor'">
				<hr class="mb-4 mt-8" />
				<editor-profile-external-professor
					v-model:university="professorUniversity"
					v-model:faculty="professorFaculty"
					v-model:knowledgeAreas="professorKnowledgeAreas"
				/>
			</template>
			<template v-else-if="type === 'CommunityPartner'">
				<hr class="mb-4 mt-8" />
				<editor-profile-community-partner
					v-model:sector="communityPartnerSector"
					v-model:url="communityPartnerUrl"
					v-model:mission="communityPartnerMission"
					v-model:name="communityPartnerName"
				/>
			</template>

			<label class="label mt-4 cursor-pointer justify-start gap-2">
				<input v-model="acceptedTerms" type="checkbox" class="checkbox" />
				<span class="label-text">Acepto las <nuxt-link to="/registro/condiciones-de-uso">Condiciones de Uso</nuxt-link></span>
			</label>

			<button type="submit" class="btn btn-info mt-4" :disabled="!filled">Registrarse</button>
		</form>
	</div>
</template>

<script setup lang="ts">
const { organization } = useRuntimeConfig().public;

const inputRepeatPassword = ref<HTMLInputElement>(null!);

const error = refAutoReset<string | null>(null, 30000);

const type = ref<'ExternalStudent' | 'ExternalProfessor' | 'CommunityPartner' | null>(null);
const firstName = ref('');
const lastName = ref('');
const email = ref('');
const phone = ref<number>();
const password = ref('');
const repeatPassword = ref('');

const studentUniversity = ref<number>();
const studentDegree = ref('');

const professorUniversity = ref<number>();
const professorKnowledgeAreas = ref<number[]>([]);
const professorFaculty = ref('');

const communityPartnerSector = ref('');
const communityPartnerUrl = ref('');
const communityPartnerMission = ref('');
const communityPartnerName = ref('');

const acceptedTerms = ref(false);

const filled = computed(() => {
	if (
		!firstName.value ||
		!lastName.value ||
		!email.value ||
		!phone.value ||
		!password.value ||
		!repeatPassword.value ||
		!acceptedTerms.value ||
		!type.value
	) {
		return false;
	}

	if (type.value === 'ExternalStudent') {
		return studentUniversity.value && studentDegree.value;
	}

	if (type.value === 'ExternalProfessor') {
		return professorUniversity.value && professorKnowledgeAreas.value && professorFaculty.value;
	}

	if (type.value === 'CommunityPartner') {
		return communityPartnerSector.value && communityPartnerUrl.value && communityPartnerMission.value && communityPartnerName.value;
	}
});

const auth = useAuth();
const router = useRouter();
async function performRequest() {
	if (!filled.value) {
		return;
	}

	if (password.value !== repeatPassword.value) {
		return;
	}

	const base = {
		email: email.value,
		firstName: firstName.value,
		lastName: lastName.value,
		phone: phone.value,
		password: password.value,
		acceptedTerms: acceptedTerms.value
	};
	const body =
		type.value === 'ExternalProfessor'
			? { ...base, data: getExternalProfessorData() }
			: type.value === 'ExternalStudent'
				? { ...base, data: getExternalStudentData() }
				: { ...base, data: getInternalCommunityPartnerData() };

	try {
		await $fetch('/api/users', { method: 'POST', body });
		await router.push(auth.redirectTo.value);
	} catch (e: any) {
		error.value = String(e.statusMessage ?? e.message ?? e);
	}
}

function getExternalProfessorData() {
	return {
		role: 'ExternalProfessor',
		university: professorUniversity.value,
		faculty: professorFaculty.value,
		knowledgeAreas: professorKnowledgeAreas.value
	};
}

function getExternalStudentData() {
	return {
		role: 'ExternalStudent',
		degree: studentDegree.value,
		university: studentUniversity.value
	};
}

function getInternalCommunityPartnerData() {
	return {
		role: 'CommunityPartner',
		sector: communityPartnerSector.value,
		url: communityPartnerUrl.value,
		mission: communityPartnerMission.value,
		name: communityPartnerName.value
	};
}

function onPasswordUpdate() {
	if (password.value !== repeatPassword.value) {
		inputRepeatPassword.value.setCustomValidity('Las contraseñas no coinciden');
	} else {
		inputRepeatPassword.value.setCustomValidity('');
	}
}
</script>
