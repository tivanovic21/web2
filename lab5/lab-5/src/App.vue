<script setup>
import { RouterView } from 'vue-router';

</script>

<template>
  <header>
    <nav class="d-flex justify-content-center bg-light border border-bottom border-dark p-3 w-100">
      <RouterLink to="/" class="mx-3">Početna</RouterLink>
    </nav>
  </header>
  <RouterView />
</template>

<style scoped></style>
