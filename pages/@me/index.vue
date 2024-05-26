<template>
	<h1 class="mb-4 text-3xl font-semibold">Perfil</h1>
	<alert v-if="error" type="danger" title="Error" class="col-span-3">
		No se pudo cargar los datos de usuario. Por favor, inténtelo de nuevo más tarde.
		{{ error.statusMessage ?? error.message ?? error }}
	</alert>

	<form v-else-if="user" @submit.prevent="performRequest" class="w-full">
		<!-- User Data -->
		<div class="mt-8 flex w-full flex-row gap-4 rounded-lg bg-base-200 p-4 drop-shadow-lg">
			<!-- Information -->
			<div class="grow">
				<h2 class="mb-2 text-left text-2xl font-semibold">
					<Icon name="material-symbols:settings-account-box-rounded" class="h-8 w-8" aria-hidden="true" />
					Datos de Usuario
				</h2>

				<div class="grid grid-cols-2 gap-4">
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
							:value="email"
							type="email"
							placeholder="Introduzca sus apellidos"
							autocomplete="family-name"
							class="input input-bordered w-full !border-base-300 !bg-base-300"
							disabled
						/>
					</label>

					<label class="form-control w-full">
						<div class="label">
							<span class="label-text">Teléfono</span>
						</div>
						<input
							v-model="phone"
							type="tel"
							placeholder="Introduzca sus apellidos"
							autocomplete="tel"
							required
							class="input input-bordered w-full"
						/>
					</label>
				</div>
			</div>

			<!-- Avatar -->
			<div ref="avatarContainerElement" class="relative h-48 w-48 shrink-0">
				<div class="relative mx-auto block">
					<picture class="block overflow-hidden rounded-full">
						<avatar :src="avatarId" />
					</picture>
					<div
						class="absolute bottom-0 left-0 right-0 top-0 rounded-full bg-black/40 opacity-0 outline outline-info transition-opacity"
						:class="{ 'opacity-100': isOverDropZone }"
					>
						<div class="h-full w-full content-center text-center text-xl font-semibold drop-shadow-md">
							<span
								class="rounded-lg border-2 border-dotted border-base-300/80 bg-info p-2 text-info-content outline outline-4 outline-info"
							>
								<Icon name="material-symbols:imagesmode-rounded" class="h-6 w-6" />
								Subir
							</span>
						</div>
					</div>

					<div class="absolute bottom-0 left-0">
						<label for="avatar-file-upload" class="btn btn-neutral btn-sm">
							<Icon name="material-symbols:edit-rounded" />
							Editar
						</label>
					</div>
				</div>
			</div>
		</div>

		<!-- Role Data -->
		<div class="mt-8 grid w-full rounded-lg bg-base-200 p-4 drop-shadow-lg">
			<h2 class="mb-2 text-left text-2xl font-semibold">
				<Icon name="material-symbols:user-attributes-rounded" class="h-8 w-8" aria-hidden="true" />
				Información
			</h2>

			<div class="grid grid-cols-3 gap-4">
				<editor-profile-admin v-if="user.role === 'Admin'" />
				<editor-profile-tutor v-else-if="user.role === 'Tutor'" />
				<editor-profile-internal-professor v-else-if="user.role === 'InternalProfessor'" />
				<editor-profile-external-professor
					v-else-if="user.role === 'ExternalProfessor'"
					v-model:university="university"
					v-model:faculty="faculty"
					v-model:knowledgeAreas="knowledgeAreas"
				/>
				<editor-profile-internal-student v-else-if="user.role === 'InternalStudent'" v-model:degree="degreeId" />
				<editor-profile-external-student
					v-else-if="user.role === 'ExternalStudent'"
					v-model:university="university"
					v-model:degree="degreeName"
				/>
				<editor-profile-collaborator v-else-if="user.role === 'Collaborator'" v-model:university="university" v-model:faculty="faculty" />
				<editor-profile-community-partner
					v-else-if="user.role === 'CommunityPartner'"
					v-model:sector="communityPartnerSector"
					v-model:url="communityPartnerUrl"
					v-model:mission="communityPartnerMission"
					v-model:name="communityPartnerName"
				/>
				<editor-profile-aps-office v-else-if="user.role === 'ApSOffice'" />
			</div>
		</div>

		<!-- Security -->
		<div class="relative -z-10 mt-8 w-full rounded-lg bg-base-200 p-4 outline-dashed drop-shadow-lg">
			<h2 class="mb-2 text-left text-2xl font-semibold">
				<Icon name="material-symbols:shield-lock-rounded" class="h-8 w-8" aria-hidden="true" />
				Seguridad
			</h2>
			<div class="grid grid-cols-3 gap-4">
				<label class="form-control w-full">
					<div class="label">
						<span class="label-text">Contraseña Actual</span>
					</div>
					<input
						ref="inputCurrentPassword"
						v-model="currentPassword"
						type="password"
						placeholder="Contraseña actual"
						autocomplete="current-password"
						minlength="6"
						:required="password !== ''"
						class="input input-bordered w-full"
						@change="onPasswordUpdate"
					/>
				</label>

				<label class="form-control w-full">
					<div class="label">
						<span class="label-text">Contraseña</span>
					</div>
					<input
						v-model="password"
						type="password"
						placeholder="Introduzca una contraseña nueva"
						autocomplete="new-password"
						minlength="6"
						class="input input-bordered w-full"
						@change="onPasswordUpdate"
					/>
				</label>

				<label class="form-control w-full">
					<div class="label">
						<span class="label-text">Repita la contraseña</span>
					</div>
					<input
						ref="inputRepeatPassword"
						v-model="repeatPassword"
						type="password"
						placeholder="Introduzca la contraseña nuevamente"
						autocomplete="off"
						minlength="6"
						:required="password !== ''"
						class="input input-bordered w-full"
						@change="onPasswordUpdate"
					/>
				</label>
			</div>
		</div>
	</form>

	<input id="avatar-file-upload" type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/tiff" class="hidden" @change="setFile" />
</template>

<script setup lang="ts">
import type { ViewUser } from '~/server/utils/database/services/types/views/User';

definePageMeta({ auth: true });

const auth = useAuth();
const avatarId = computed(() => auth.session.value?.avatar ?? null);

const { data, error, execute } = useFetch('/api/users/@me', { method: 'GET', immediate: false });
if (auth.loggedIn.value) {
	await execute();
}

const avatarContainerElement = ref<HTMLDivElement>(null!);
const { files: dropZoneFiles, isOverDropZone } = useDropZone(avatarContainerElement, {
	dataTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/tiff']
});

const user = data.value as ViewUser.Value | null;
const firstName = ref(user?.firstName ?? '');
const lastName = ref(user?.lastName ?? '');
const email = ref(user?.email ?? '');
const phone = ref(user?.phone ?? null);
const file = ref<File | null>(null);
const currentPassword = ref('');
const password = ref('');
const repeatPassword = ref('');

watch(dropZoneFiles, (files) => {
	file.value = files?.length ? files[0] : null;
});

const degreeId = ref(0);
const degreeName = ref('');
const university = ref(0);
const knowledgeAreas = ref<number[]>([]);
const faculty = ref('');

const communityPartnerSector = ref('');
const communityPartnerUrl = ref('');
const communityPartnerMission = ref('');
const communityPartnerName = ref('');
if (user) {
	switch (user.role) {
		case 'ExternalStudent':
			university.value = user.university;
			degreeName.value = user.degree;
			break;
		case 'ExternalProfessor':
			university.value = user.university;
			knowledgeAreas.value = user.knowledgeAreas.slice();
			faculty.value = user.faculty;
			break;
		case 'CommunityPartner':
			communityPartnerSector.value = user.sector;
			communityPartnerUrl.value = user.url;
			communityPartnerMission.value = user.mission;
			communityPartnerName.value = user.name;
			break;
		case 'InternalStudent':
			degreeId.value = user.degree;
			break;
		case 'Collaborator':
			university.value = user.university;
			faculty.value = user.faculty;
			break;
	}
}

const inputCurrentPassword = ref<HTMLInputElement>(null!);
const inputRepeatPassword = ref<HTMLInputElement>(null!);

function onPasswordUpdate() {
	if (password.value === '') {
		inputCurrentPassword.value.setCustomValidity('');
		inputRepeatPassword.value.setCustomValidity('');
		return;
	}

	if (!currentPassword.value && password.value) {
		inputCurrentPassword.value.setCustomValidity('Introduzca su contraseña actual');
	} else {
		inputCurrentPassword.value.setCustomValidity('');
	}

	if (password.value !== repeatPassword.value) {
		inputRepeatPassword.value.setCustomValidity('Las contraseñas no coinciden');
	} else {
		inputRepeatPassword.value.setCustomValidity('');
	}
}

function setFile(event: Event) {
	const target = event.target as HTMLInputElement;
	file.value = target.files?.length ? target.files[0] : null;
}

function performRequest() {}
</script>

<style scoped></style>
