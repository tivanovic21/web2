<script setup>
import { useFavoritesStore } from '@/stores/favorites';

const favoritesStore = useFavoritesStore();

const handleRemove = (bookKey) => {
    favoritesStore.removeFavorite(bookKey);
};
</script>

<template>
    <div class="col">
        <h1>Your favorite books</h1>
        <div v-if="favoritesStore.favorites.length === 0">
            <p>No favorites yet.</p>
        </div>
        <div v-else class="flex">
            <div v-for="book in favoritesStore.favorites" :key="book.key" class="favorite-card">
                <img v-if="book.cover_id" :src="`https://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg`"
                    :alt="book.title" style="width:120px; height:180px; object-fit:cover;" />
                <h4>{{ book.title }}</h4>
                <button @click="handleRemove(book.key)">Remove</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.flex {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
}

.col {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.favorite-card {
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 12px;
    width: 180px;
    text-align: center;
    margin: 8px;
}
</style>