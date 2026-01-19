<script setup>
import Card from '@/components/Card.vue';
import Grid from '@/components/Grid.vue';
import { SubjectEnum } from '@/models/SubjectEnum';
import { useRouter } from 'vue-router';
const router = useRouter();
const handleClick = (subject) => {
    router.push({ name: 'subject', params: { subjectKey: subject.key } });
}
</script>

<template>
    <div class="col">
        <h1>Welcome to the Book Explorer</h1>
        <Grid :items="SubjectEnum" :CardComponent="Card" :cardProps="subject => ({
            subject: subject,
            handleClick: () => handleClick(subject)
        })" />
    </div>
</template>

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