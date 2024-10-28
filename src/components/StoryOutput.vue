<script setup lang="ts">
defineProps<{
  story: string;
}>();
</script>

<template>
  <div v-if="story" class="story-output">
    <h3>Your Magical Story:</h3>
    <div class="story-content">{{ story }}</div>
  </div>
</template>

<style scoped>
.story-output {
  margin-top: 2rem;
  padding: 1.5rem;
  background-color: #f8f8f8;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.story-content {
  white-space: pre-wrap;
  line-height: 1.6;
  color: #333;
  font-size: 1.1rem;
}
</style>