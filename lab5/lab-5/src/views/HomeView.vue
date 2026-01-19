<template>
    <div class="col">
        <h1>Welcome to the Book Explorer</h1>
        <div class="flex">
            <Card v-for="book in SubjectEnum" :key="book.key" :subject="book" :handle-click="() => handleClick(book)" />
        </div>
    </div>
</template>

<script setup>
import Card from '@/components/Card.vue';
import { SubjectEnum } from '@/models/SubjectEnum';
import { useRouter } from 'vue-router';
const router = useRouter();
const handleClick = (book) => {
    router.push({ name: 'subject', params: { subjectKey: book.key } });
}
</script>

<style lang="css" scoped>
.flex {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
}

.col {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
</style>