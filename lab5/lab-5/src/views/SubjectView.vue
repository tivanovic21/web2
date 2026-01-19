<script setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useSubjectBooks } from '@/hooks/useSubjectBooks';
import Card from '@/components/Card.vue';
import Grid from '@/components/Grid.vue';
import { SubjectEnum } from '@/models/SubjectEnum';
import { useFavoritesStore } from '@/stores/favorites';

const route = useRoute();
const subjectKey = route.params.subjectKey;
const genre = SubjectEnum.find(s => s.key === subjectKey);
const { books, loading, error, fetchBooks } = useSubjectBooks(subjectKey);
const favoritesStore = useFavoritesStore();

const handleAddToFavorites = (book) => {
    favoritesStore.addFavorite(book);
};

const isInFavorites = (bookKey) => {
    return favoritesStore.favorites.some(fav => fav.key === bookKey);
};

onMounted(async () => {
    await fetchBooks();
});
</script>

<template>
    <div class="col">
        <h1>Genre: {{ genre.label }}</h1>
        <div class="flex">
            <div v-if="loading">Loading books...</div>
            <div v-else-if="error">An error occurred: {{ error }}</div>
            <div v-else>
                <Grid :items="books" :CardComponent="Card" :cardProps="book => ({
                    subject: {
                        label: book.title,
                        image: book.cover_id ? `https://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg` : '',
                        description: null,
                        key: book.key,
                    },
                    showButton: !isInFavorites(book.key),
                    buttonValue: 'Add to favorites',
                    bookData: book
                })" @add-to-favorites="handleAddToFavorites" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.flex {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
}

.col {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    flex-direction: column;
}
</style>