<template>
    <div class="col">
        <h1>Genre: {{ genre.label }}</h1>
        <div class="flex">
            <div v-if="loading">Loading books...</div>
            <div v-else-if="error">An error occurred: {{ error }}</div>
            <div v-else>
                <div class="flex">
                    <Card v-for="book in books" :key="book.key" :subject="{
                        label: book.title,
                        image: book.cover_id ? `https://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg` : '',
                        description: null,
                        key: book.key,
                    }" :handle-click="() => { }" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useSubjectBooks } from '@/hooks/useSubjectBooks';
import Card from '@/components/Card.vue';
import { SubjectEnum } from '@/models/SubjectEnum';

const route = useRoute();
const subjectKey = route.params.subjectKey;

const genre = SubjectEnum.find(s => s.key === subjectKey);

const { books, loading, error, fetchBooks } = useSubjectBooks(subjectKey);

onMounted(async () => {
    await fetchBooks();
});
</script>

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