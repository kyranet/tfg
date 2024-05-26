<template></template>

<script setup lang="ts">
import type { PageMeta } from '#app';

definePageMeta({ auth: true, roles: ['Admin'] } satisfies PageMeta);
definePrivateAreaSeo({ title: 'Gestor de Suscripciones' });
</script>
