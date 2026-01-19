<script setup>
import { ref, watch } from 'vue';

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

// state
const count = ref(props.items ? props.items.length : 0);

watch(() => props.items, (newVal) => {
    count.value = (newVal || []).length;
}, { immediate: true, deep: true });
</script>

<template>
    <div>
        <div class="grid-header">Showing <strong>{{ count }}</strong> {{ count === 1 ? 'item' : 'items' }}</div>
        <div class="grid">
            <component v-for="item in items" :is="CardComponent" :key="item.key" v-bind="cardProps(item)"
                @add-to-favorites="handleAddToFavorites" />
        </div>
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

.grid-header {
    width: 100%;
    text-align: center;
    margin-bottom: 12px;
    font-size: 1.05rem;
    color: #222;
}
</style>