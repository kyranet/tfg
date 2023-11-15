<template>
	<Carousel :items="slides" />

	<section class="mt-20 text-center">
		<h2 class="text-center text-3xl font-semibold">Cómo participar</h2>
		<hr class="mb-6 mt-1" />
		<div class="grid md:grid-cols-3">
			<div class="flex flex-col items-center gap-2">
				<Icon name="fa6-solid:user-graduate" size="96" />
				<h3 class="font-semibold uppercase">Estudiantes</h3>
				<ul>
					<li>Participa en un proyecto ApS integrado en una asignatura.</li>
					<li>Sugiere una iniciativa ApS para una comunidad, ONG, etc.</li>
				</ul>
				<NuxtLink
					href="/como-participar/estudiantes"
					class="mt-2 inline-block w-fit rounded-md bg-gray-500 px-4 py-1 uppercase text-white hover:bg-gray-600"
				>
					Ver
				</NuxtLink>
			</div>
			<div class="flex flex-col items-center gap-2">
				<Icon name="fa6-solid:chalkboard-user" size="96" />
				<h3 class="font-semibold uppercase">Profesores</h3>
				<ul class="grow">
					<li>Respalda una demanda de servicio ApS.</li>
					<li>Oferta un servicio de ApS.</li>
				</ul>
				<NuxtLink
					href="/como-participar/profesores"
					class="mt-2 inline-block w-fit rounded-md bg-gray-500 px-4 py-1 uppercase text-white hover:bg-gray-600"
				>
					Ver
				</NuxtLink>
			</div>
			<div class="flex flex-col items-center gap-2">
				<Icon name="fa6-solid:landmark" size="96" />
				<div class="i-fas-university text-8xl"></div>
				<h3 class="font-semibold uppercase">Socios comunitarios</h3>
				<ul>
					<li>Acepta una oferta de servicio ApS de la Universidad.</li>
					<li>Demanda un servicio ApS para una comunidad, ONG, etc.</li>
				</ul>
				<NuxtLink
					href="/como-participar/socios-comunitarios"
					class="mt-2 inline-block w-fit rounded-md bg-gray-500 px-4 py-1 uppercase text-white hover:bg-gray-600"
				>
					Ver
				</NuxtLink>
			</div>
		</div>
	</section>

	<section class="mt-20 text-center">
		<h2 class="text-center text-3xl font-semibold">Destacados</h2>
		<hr class="mb-6 mt-1" />
		<div class="grid md:grid-cols-3">
			<div>
				<span class="text-5xl font-extrabold">{{ stats?.proyectos ?? 0 }}</span>
				<h3 class="font-semibold uppercase">Proyectos</h3>
				<p>registrados en el Portal ApS</p>
				<NuxtLink href="/proyectos" class="mt-2 inline-block rounded-md bg-gray-500 px-4 py-1 uppercase text-white hover:bg-gray-600">
					Ver
				</NuxtLink>
			</div>
			<div>
				<span class="text-5xl font-extrabold">{{ stats?.partenariados ?? 0 }}</span>
				<h3 class="font-semibold uppercase">Partenariados</h3>
				<p>registrados en el Portal ApS</p>
				<NuxtLink href="/partenariados" class="mt-2 inline-block rounded-md bg-gray-500 px-4 py-1 uppercase text-white hover:bg-gray-600">
					Ver
				</NuxtLink>
			</div>
			<div>
				<span class="text-5xl font-extrabold">{{ stats?.ofertas ?? 0 }}</span>
				<h3 class="font-semibold uppercase">Ofertas</h3>
				<p>registrados en el Portal ApS</p>
				<NuxtLink href="/ofertas" class="mt-2 inline-block rounded-md bg-gray-500 px-4 py-1 uppercase text-white hover:bg-gray-600">
					Ver
				</NuxtLink>
			</div>
		</div>
	</section>

	<section class="mt-20">
		<h2 class="text-center text-3xl font-semibold">Noticias</h2>
		<hr class="mb-6 mt-1" />
		<div class="grid gap-2 md:grid-cols-3">
			<div v-for="entry of news" :key="entry.title" class="rounded-lg border bg-base-200 p-4">
				<h3 class="mb-2 text-xl font-semibold">{{ entry.title }}</h3>
				<p class="text-sm">{{ entry.description }}</p>
				<div class="mt-4 flex justify-between">
					<NuxtLink :href="entry.link">
						<button class="rounded-md bg-gray-500 px-2 uppercase text-white hover:bg-gray-600">Ver</button>
					</NuxtLink>
					<span class="text-sm opacity-75">{{ entry.link.startsWith('/') ? '(esta web)' : `(${entry.link})` }}</span>
				</div>
			</div>
		</div>
	</section>

	<section class="mt-20 rounded-lg bg-uned-green text-white">
		<form class="form-subscribe p-4">
			<h2 class="text-2xl font-bold uppercase">Suscríbete</h2>
			<p>Recibe nuestra newsletter y avisos de proyectos</p>
			<div class="form-subscribe-input">
				<input type="email" name="email" placeholder="Introduce tu correo electrónico" class="grow rounded-l-lg px-4" />
				<input type="submit" value="Suscribir" class="rounded-r-lg bg-gray-600 px-4 py-2 font-bold uppercase" />
			</div>
		</form>
	</section>
</template>

<script setup lang="ts">
const slides = [
	{
		src: '/img/carousel1.jpg',
		text: 'Incorpora el ApS en tu docencia'
	},
	{
		src: '/img/carousel2.jpg',
		text: 'Cursa asignaturas que integran ApS'
	},
	{
		src: '/img/carousel3.jpg',
		text: 'Contribuye a la formación universitaria recibiendo un servicio en tu comunidad'
	}
];

const news = [
	{
		title: 'Portal ApS UNED activo',
		description: 'La UNED ha lanzado un nuevo portal para gestionar proyectos de Aprendizaje Servicio.',
		link: '/'
	},
	{
		title: 'UNED - Oficina ApS',
		description: 'Os invitamos a conocer la oficina ApS de la UNED, con vídeos, webinars ¡y mucho más!',
		link: 'https://blogs.uned.es/aps'
	},
	{
		title: 'Red Española Aprendizaje-Servicio',
		description: 'Hay nuevas informaciones en el blog de aprendizajeservicio.net, ¡pásate a verlas!',
		link: 'https://www.aprendizajeservicio.net'
	}
];

const { data: stats } = await useFetch('/api/summary');
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
	@apply flex;
}
</style>
