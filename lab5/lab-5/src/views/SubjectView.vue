<script setup>
import { onMounted, ref, computed } from 'vue';
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

// lifecycle hook
onMounted(async () => {
    // asinkroni dohvat podataka
    await fetchBooks();
});

// two-way binding
const searchQuery = ref('');
const showOnlyNotFavorites = ref(false);

// computed property
const filteredBooks = computed(() => {
    const list = books.value || [];
    let result = list;
    const q = (searchQuery.value || '').trim().toLowerCase();
    if (q) {
        result = result.filter(b => (b.title || '').toLowerCase().includes(q));
    }
    if (showOnlyNotFavorites.value) {
        result = result.filter(b => !favoritesStore.favorites.some(f => f.key === b.key));
    }
    return result;
});
</script>

<template>
    <div class="col">
        <h1>Genre: {{ genre.label }}</h1>
        <div class="flex">
            <div v-if="loading">Loading books...</div>
            <div v-else-if="error">An error occurred: {{ error }}</div>
            <div v-else>
                <div class="controls">
                    <input v-model="searchQuery" placeholder="Search titles..." />
                    <label class="filter-label"><input type="checkbox" v-model="showOnlyNotFavorites" /> Show only books
                        that aren't in favorites</label>
                </div>
                <Grid :items="filteredBooks" :CardComponent="Card" :cardProps="book => ({
                    subject: {
                        label: book.title,
                        image: book.cover_id ? `https://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg` : '',
                        description: null,
                        key: book.key,
                    },
                    showButton: !isInFavorites(book.key),
                    buttonValue: 'Add to favorites',
                    bookData: book
                })" @add-to-favorites="handleAddToFavorites" :showCounter="true" />
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

.controls {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 22px;
    margin-bottom: 18px;
}

.filter-label {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 1.15rem;
    color: #111;
}

.filter-label input[type="checkbox"] {
    transform: scale(1.35);
    margin: 4px 0;
}
</style>