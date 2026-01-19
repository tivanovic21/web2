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

const emit = defineEmits(['add-to-favorites']);

const handleAddToFavorites = (event) => {
    emit('add-to-favorites', event);
};
</script>

<template>
    <div class="grid">
        <component v-for="item in items" :is="CardComponent" :key="item.key" v-bind="cardProps(item)"
            @add-to-favorites="handleAddToFavorites" />
    </div>
</template>

<style lang="css" scoped>
.grid {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    justify-content: center;
    align-items: flex-start;
}
</style>