<script setup>
import { useFavoritesStore } from '@/stores/favorites';
import Card from '@/components/Card.vue';
import Grid from '@/components/Grid.vue';

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
        <div v-else>
            <Grid :items="favoritesStore.favorites" :CardComponent="Card" :cardProps="book => ({
                subject: {
                    label: book.title,
                    image: book.cover_id ? `https://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg` : '',
                    key: book.key
                },
                showButton: true,
                buttonValue: 'Remove',
                handleClick: () => handleRemove(book)
            })" />
        </div>
    </div>
</template>

<style lang="css" scoped>
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