<template>
    <div class="card-body" @click="handleClick">
        <div class="card-image">
            <img :src="subject.image" :alt="subject.label" class="card-img" />
        </div>
        <div class="card-info">
            <h3 class="card-title">{{ subject.label }}</h3>
            <p class="card-description">{{ subject.description }}</p>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    subject: {
        type: Object,
        required: true
    },
    handleClick: {
        type: Function,
        required: true
    }
});
const subject = props.subject;
const handleClick = props.handleClick;
</script>

<style scoped>
.card-body {
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 12px;
    width: 180px;
    text-align: center;
    margin: 8px;
}

.card-body:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    cursor: pointer;
}

.card-image img {
    border-radius: 4px;
}


.card-body {
    border: 1px solid #ccc;
    border-radius: 16px;
    padding: 16px;
    width: 260px;
    height: 420px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    text-align: center;
    margin: 16px;
    background: #fafafa;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
}

.card-image {
    width: 220px;
    height: 280px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 18px;
}

.card-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 12px;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.10);
}

.card-title {
    font-size: 1.4em;
    font-weight: bold;
    margin-bottom: 8px;
}

.card-key {
    color: #888;
    font-size: 1em;
}
</style>