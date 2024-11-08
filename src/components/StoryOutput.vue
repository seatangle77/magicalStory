<script setup lang="ts">
const props = defineProps<{
  story: string;
  isFinal: boolean;
}>();
</script>

<template>
  <div v-if="story" class="story-output">
    <h3 v-if="isFinal" class="story-title">Your Magical Story:</h3>
    <div class="story-content">{{ story }}</div>
  </div>
</template>

<style scoped>
.story-output {
  margin-top: 1rem;
  padding: 1rem 1.5rem;
  background-color: #ffffff;
  border-left: 4px solid #42b883;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.story-title {
  margin: 0 0 0.5rem;
  font-size: 1.2rem;
  color: #333;
  font-weight: bold;
}

.story-content {
  white-space: pre-wrap;
  line-height: 1.6;
  color: #555;
  font-size: 1rem;
}
</style>