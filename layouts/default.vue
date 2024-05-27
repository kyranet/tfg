<template>
	<div class="flex min-h-screen flex-col">
		<sections-app-header></sections-app-header>
		<main class="layout-container flex flex-grow flex-col items-center">
			<slot></slot>
		</main>
		<sections-app-footer></sections-app-footer>
	</div>
</template>
