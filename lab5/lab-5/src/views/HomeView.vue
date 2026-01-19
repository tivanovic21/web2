<template>
    <div class="col">
        <h1>Dobrodošli </h1>
        <div class="flex">
            <SubjectCard v-for="book in SubjectEnum" :key="book.key" :subject="book" />
        </div>
    </div>
</template>

<script setup>
import SubjectCard from '@/components/SubjectCard.vue';
import { SubjectEnum } from '@/models/SubjectEnum';
</script>

<style lang="css" scoped>
.flex {
    display: flex;
    justify-content: center;
    align-items: center;
}

.col {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
</style>