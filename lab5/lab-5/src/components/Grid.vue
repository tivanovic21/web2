<script setup>
const props = defineProps({
    items: {
        type: Array,
        required: true
    },
    CardComponent: {
        type: Object,
        required: true
    },
    cardProps: {
        type: Function,
        required: true
    }
});
</script>

<template>
    <div class="grid">
        <component v-for="item in items" :is="CardComponent" :key="item.key" v-bind="cardProps(item)" />
    </div>
</template>

<style scoped>
.grid {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    justify-content: center;
    align-items: flex-start;
}
</style>