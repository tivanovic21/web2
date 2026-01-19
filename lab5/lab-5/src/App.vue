<script setup>
import { RouterView } from 'vue-router';
</script>

<template>
  <header>
    <nav class="navFlex">
      <RouterLink to="/" class="mx-3">Home</RouterLink>
      <RouterLink to="/favorites" class="mx-3">Favorites</RouterLink>
    </nav>
  </header>
  <RouterView />
</template>

<style scoped>
nav a {
  text-decoration: none;
  color: #333;
  font-weight: bold;
}

nav a:hover {
  color: #007BFF;
}

.navFlex {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  gap: 16px;
  background-color: #f5f5f5;
}
</style>
